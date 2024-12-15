import { PrismaClient, Prisma } from "@prisma/client";
import { uploadToS3, deleteS3Object } from "../utils/uploadToS3.js";
import multer from 'multer';

const upload = multer().fields([{ name: 'media', maxCount: 5 }]); // Accepting up to 5 files under 'media'

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function getLandlordId(user_name) {
  const dbUser = await prisma.user.findUnique({
    where: { user_name },
    include: { Landlord: true },
  });

  if (!dbUser || !dbUser.Landlord) {
    throw new Error("Associated landlord profile not found");
  }

  return dbUser.Landlord.landlord_id;
}

export const createProperty = async (req, res) => {
  try {
    console.log("Incoming request to create property:", req.body);

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user);
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { address, rent, amenities } = req.body;

    if (!Array.isArray(amenities)) {
      return res.status(400).json({ success: false, error: "Amenities must be an array" });
    }

    const landlord_id = await getLandlordId(req.user.userName);
    console.log("createProperty called with landlord_id:", landlord_id);

    // Create the property in the Property table
    const property = await prisma.property.create({
      data: {
        landlord_id,
        address,
        rent: parseFloat(rent),
        amenities,
      },
      include: { landlord: true },
    });

    // Handle media uploads
    if (req.files && req.files.length > 0) {
      const mediaEntries = await Promise.all(
        req.files.map(async (file) => {
          const fileName = await uploadToS3(file); // Upload file to S3
          return {
            model_name: 'property', // Model name (for example, "property")
            model_id: property.property_id, // Associate this media with the created property
            media_url: fileName, // URL of the file uploaded to S3
            media_type: file.mimetype, // File type (MIME type)
            media_category: 'property_image', // Media category for properties
          };
        })
      );

      // Insert media entries into the Media table
      await prisma.media.createMany({
        data: mediaEntries, // Insert all media entries at once
      });

      console.log("Media entries inserted into the media table:", mediaEntries);
    }

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error creating property:", error.message, error.stack);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ success: false, error: "A property with this address already exists" });
    }
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while creating the property" });
  }
};



export const getAllProperties = async (req, res) => {
  try {
    console.log("Request to get all properties for user:", req.user); // Log user info

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user); // Log user object
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const landlord_id = await getLandlordId(req.user.userName);
    console.log("getAllProperties called with landlord_id:", landlord_id);

    const properties = await prisma.property.findMany({
      where: { landlord_id },
      include: { landlord: true },
    });

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    console.error("Error retrieving properties:", error.message, error.stack);
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving properties" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    console.log("Request to get property by ID for user:", req.user); // Log user info

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user); // Log user object
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { id } = req.params;
    const landlord_id = await getLandlordId(req.user.userName);
    console.log("getPropertyById called with landlord_id:", landlord_id);

    const property = await prisma.property.findUnique({
      where: { property_id: id, landlord_id },
      include: { landlord: true },
    });

    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found or does not belong to you" });
    }

    res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error retrieving property:", error.message, error.stack);
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving the property" });
  }
};

export const updateProperty = async (req, res) => {
  try {
    if (!req.user || !req.user.userName) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { id } = req.params;
    const { rent, amenities, imagesToDelete } = req.body;
    
    const landlord_id = await getLandlordId(req.user.userName);

    const updateData = {};
    if (rent) updateData.rent = parseFloat(rent);
    if (amenities) {
      const amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      if (!Array.isArray(amenitiesArray)) {
        return res.status(400).json({ success: false, error: "Amenities must be an array" });
      }
      updateData.amenities = amenitiesArray;
    }

    if (imagesToDelete) {
      const imageIdsToDelete = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
      for (const imageId of imageIdsToDelete) {
        const media = await prisma.media.findUnique({ where: { media_id: imageId } });
        if (media && media.model_id === id) {
          await deleteS3Object(media.media_url);
          await prisma.media.delete({ where: { media_id: imageId } });
        }
      }
    }

    if (req.files && req.files.length > 0) {
      const mediaEntries = await Promise.all(
        req.files.map(async (file) => {
          const fileName = await uploadToS3(file);
          return {
            model_name: 'property',
            model_id: id,
            media_url: fileName,
            media_type: file.mimetype,
            media_category: 'property_image',
          };
        })
      );
      await prisma.media.createMany({ data: mediaEntries });
    }

    const updatedProperty = await prisma.property.update({
      where: { property_id: id, landlord_id },
      data: updateData,
    });

    const media = await prisma.media.findMany({
      where: { model_name: 'property', model_id: id }
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: { ...updatedProperty, media }
    });

  } catch (error) {
    console.error("Error updating property:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    res.status(500).json({ 
      success: false, 
      error: "An unexpected error occurred while updating the property" 
    });
  }
};


export const deleteProperty = async (req, res) => {
  try {
    console.log("Request to delete property for user:", req.user); // Log user info

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user); // Log user object
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { id } = req.params;
    const landlord_id = await getLandlordId(req.user.userName);
    console.log("deleteProperty called with landlord_id:", landlord_id);

    // Fetch all media associated with the property before deleting
    const media = await prisma.media.findMany({
      where: { model_name: "property", model_id: id },
    });

    // Delete media files from S3
    if (media.length > 0) {
      const deletePromises = media.map(async (mediaFile) => {
        try {
          await deleteS3Object(mediaFile.media_url); // Delete media from S3
          console.log(`Deleted media from S3: ${mediaFile.media_url}`);
        } catch (error) {
          console.error(`Error deleting media from S3: ${mediaFile.media_url}`, error);
        }
      });

      await Promise.all(deletePromises); // Wait for all media deletions to finish
    }

    // Delete media entries from the media table
    await prisma.media.deleteMany({
      where: { model_name: "property", model_id: id },
    });

    // Delete the property itself from the property table
    const deletedProperty = await prisma.property.delete({
      where: { property_id: id, landlord_id },
    });

    res.status(200).json({
      success: true,
      message: "Property and associated media deleted successfully",
      data: deletedProperty,
    });
  } catch (error) {
    console.error("Error deleting property:", error.message, error.stack);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while deleting the property" });
  }
};
