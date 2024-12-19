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
    if (!req.user || !req.user.userName) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { address, amenities } = req.body;
    const landlord_id = await getLandlordId(req.user.userName);

    console.log("Request body:", req.body);
    console.log("Files attached to request:", req.files);

    // Parse amenities if it's a JSON string
    const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the property
      const property = await prisma.property.create({
        data: {
          landlord_id,
          address,
        },
        include: { landlord: true },
      });

      console.log("Property created:", property);

      // Handle amenity creation and property-amenity association
      if (Array.isArray(parsedAmenities) && parsedAmenities.length > 0) {
        for (const { amenity_name, amenity_value } of parsedAmenities) {
          // Create a new amenity entry every time
          const createdAmenity = await prisma.amenity.create({
            data: {
              amenity_id: `am-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              amenity_name,
              amenity_value,
              updated_at: new Date(),
            },
          });

          // Create the association between the property and the amenity
          await prisma.PropertyAmenity.create({
            data: {
              property_amenity_id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              property_id: property.property_id,
              amenity_id: createdAmenity.amenity_id,
              updated_at: new Date(),
            },
          });
        }
      }

      console.log("Amenities processed");

      // Handle media uploads
      console.log("Starting media upload process");
      if (req.files && req.files.length > 0) {
        console.log(`Found ${req.files.length} files to upload`);
        const mediaEntries = await Promise.all(
          req.files.map(async (file, index) => {
            console.log(`Uploading file ${index + 1}/${req.files.length}`);
            try {
              const fileName = await uploadToS3(file);
              console.log(`File ${index + 1} uploaded successfully. Filename: ${fileName}`);
              return {
                media_id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                model_name: 'property',
                model_id: property.property_id,
                media_url: fileName,
                media_type: file.mimetype,
                media_category: 'property_image',
                updated_at: new Date(),
              };
            } catch (uploadError) {
              console.error(`Error uploading file ${index + 1}:`, uploadError);
              throw uploadError;
            }
          })
        );

        console.log("All files uploaded, creating media entries");
        await prisma.media.createMany({
          data: mediaEntries,
        });
        console.log("Media entries created in database");
      } else {
        console.log("No files to upload");
      }

      // Fetch the created property with all relations
      return await prisma.property.findUnique({
        where: { property_id: property.property_id },
        include: {
          landlord: true,
          PropertyAmenity: {
            include: {
              Amenity:true,
            },
          },
        },
      });
    });

    console.log("Transaction completed successfully");
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: result,
    });

  } catch (error) {
    console.error("Error creating property:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ success: false, error: "A property with this address already exists" });
    }
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ 
      success: false, 
      error: "An unexpected error occurred while creating the property" 
    });
  }
};


export const getAllProperties = async (req, res) => {
  try {
    console.log("Request to get all properties for user:", req.user);

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user);
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const landlord_id = await getLandlordId(req.user.userName);
    console.log("getAllProperties called with landlord_id:", landlord_id);

    const properties = await prisma.property.findMany({
      where: { 
        landlord_id 
      },
      include: {
        landlord: {
          include: {
            profile_picture: true
          }
        },
        PropertyAmenity: {
          include: {
            Amenity: true
          }
        },
        Listing: {
          include: {
            room_type: true
          }
        }
      }
    });

    // Get media for each property
    const propertiesWithMedia = await Promise.all(
      properties.map(async (property) => {
        const media = await prisma.media.findMany({
          where: {
            model_name: 'property',
            model_id: property.property_id
          }
        });

        return {
          ...property,
          media
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: propertiesWithMedia
    });
  } catch (error) {
    console.error("Error retrieving properties:", error.message, error.stack);
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ 
      success: false, 
      error: "An unexpected error occurred while retrieving properties" 
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    console.log("Request to get property by ID for user:", req.user);

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user);
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { id } = req.params;
    const landlord_id = await getLandlordId(req.user.userName);
    console.log("getPropertyById called with landlord_id:", landlord_id);

    const property = await prisma.property.findUnique({
      where: { property_id: id, landlord_id },
      include: {
        landlord: {
          include: {
            profile_picture: true
          }
        },
        PropertyAmenity: {
          include: {
            Amenity:true
          }
        },
        Listing: {
          include: {
            room_type: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found or does not belong to you" });
    }

    const media = await prisma.media.findMany({
      where: {
        model_name: 'property',
        model_id: id
      }
    });

    res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: { ...property, media },
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
    const { address, amenities, imagesToDelete } = req.body;
    const landlord_id = await getLandlordId(req.user.userName);

    const result = await prisma.$transaction(async (prisma) => {
      // Update basic property information
      const property = await prisma.property.update({
        where: { property_id: id, landlord_id },
        data: { address: address || undefined },
      });

      // Handle amenities update
      if (amenities) {
        const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

        // Get existing property amenities
        const existingPropertyAmenities = await prisma.PropertyAmenity.findMany({
          where: { property_id: id },
          include: { Amenity:true }
        });

        // Delete existing property-amenity associations
        await prisma.PropertyAmenity.deleteMany({
          where: { property_id: id }
        });

        // Delete orphaned amenities
        for (const propertyAmenity of existingPropertyAmenities) {
          const otherReferences = await prisma.PropertyAmenity.count({
            where: { 
              amenity_id: propertyAmenity.amenity_id,
              NOT: { property_id: id }
            }
          });

          if (otherReferences === 0) {
            await prisma.amenity.delete({
              where: { amenity_id: propertyAmenity.amenity_id }
            });
          }
        }

        // Create new amenities
        if (Array.isArray(parsedAmenities) && parsedAmenities.length > 0) {
          for (const { amenity_name, amenity_value } of parsedAmenities) {
            const createdAmenity = await prisma.amenity.create({
              data: {
                amenity_id: `am-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                amenity_name,
                amenity_value,
                updated_at: new Date(),
              },
            });

            await prisma.PropertyAmenity.create({
              data: {
                property_amenity_id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                property_id: id,
                amenity_id: createdAmenity.amenity_id,
                updated_at: new Date(),
              },
            });
          }
        }
      }

      // Rest of the media handling code remains the same
      if (imagesToDelete) {
        const imageIdsToDelete = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
        for (const imageId of imageIdsToDelete) {
          const media = await prisma.media.findUnique({
            where: { media_id: imageId }
          });
          if (media && media.model_id === id) {
            await deleteS3Object(media.media_url);
            await prisma.media.delete({
              where: { media_id: imageId }
            });
          }
        }
      }

      if (req.files && req.files.length > 0) {
        const mediaEntries = await Promise.all(
          req.files.map(async (file) => {
            const fileName = await uploadToS3(file);
            return {
              media_id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              model_name: 'property',
              model_id: id,
              media_url: fileName,
              media_type: file.mimetype,
              media_category: 'property_image',
              updated_at: new Date(),
            };
          })
        );

        await prisma.media.createMany({
          data: mediaEntries,
        });
      }

      return await prisma.property.findUnique({
        where: { property_id: id },
        include: {
          landlord: true,
          PropertyAmenity: {
            include: { Amenity:true },
          },
        },
      });
    });

    const media = await prisma.media.findMany({
      where: { model_name: 'property', model_id: id }
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: { ...result, media }
    });
  } catch (error) {
    console.error("Error updating property:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while updating the property" });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    if (!req.user || !req.user.userName) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { id } = req.params;
    const landlord_id = await getLandlordId(req.user.userName);

    const result = await prisma.$transaction(async (prisma) => {
      // Get all property amenities before deletion
      const propertyAmenities = await prisma.PropertyAmenity.findMany({
        where: { property_id: id },
        include: { Amenity: true }
      });

      // Delete media files from S3
      const media = await prisma.media.findMany({
        where: { model_name: "property", model_id: id },
      });

      if (media.length > 0) {
        await Promise.all(
          media.map(async (mediaFile) => {
            try {
              await deleteS3Object(mediaFile.media_url);
            } catch (error) {
              console.error(`Error deleting media from S3: ${mediaFile.media_url}`, error);
              throw error;
            }
          })
        );
      }

      // Delete all related records
      await prisma.media.deleteMany({
        where: { model_name: "property", model_id: id },
      });

      await prisma.PropertyAmenity.deleteMany({
        where: { property_id: id },
      });

      await prisma.listing.deleteMany({
        where: { property_id: id },
      });

      // Delete orphaned amenities
      for (const propertyAmenity of propertyAmenities) {
        const otherReferences = await prisma.PropertyAmenity.count({
          where: {
            amenity_id: propertyAmenity.amenity_id,
            NOT: { property_id: id }
          }
        });

        if (otherReferences === 0) {
          await prisma.amenity.delete({
            where: { amenity_id: propertyAmenity.amenity_id }
          });
        }
      }

      return await prisma.property.delete({
        where: { property_id: id, landlord_id },
      });
    });

    res.status(200).json({
      success: true,
      message: "Property and all associated data deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while deleting the property" });
  }
};
