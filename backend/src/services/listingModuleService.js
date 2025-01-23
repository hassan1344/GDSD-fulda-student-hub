import { PrismaClient, Prisma } from "@prisma/client";
import { uploadToS3, deleteS3Object } from "../utils/uploadToS3.js";

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

export const createListing = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { property_id, title, description, status, rent, room_type_id } = req.body;
  
      // Validate landlord ownership of the property
      const landlord = await prisma.user.findUnique({
        where: { user_name: req.user.userName },
        include: { Landlord: true },
      });
  
      if (!landlord || !landlord.Landlord) {
        return res.status(404).json({ success: false, error: "Landlord profile not found" });
      }
  
      const property = await prisma.property.findUnique({
        where: { property_id },
        include: { landlord: true },
      });
  
      if (!property || property.landlord_id !== landlord.Landlord.landlord_id) {
        return res.status(403).json({ success: false, error: "Unauthorized access to property" });
      }
  
      console.log("Starting transaction for creating listing...");
  
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create the listing
        const listing = await prisma.listing.create({
          data: {
            property_id,
            title,
            description,
            status,
            rent: parseFloat(rent),
            room_type_id,
          },
        });
  
        console.log("Listing created successfully:", listing);
  
        // Handle file uploads
        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            const uniqueFileName = await uploadToS3(file);
  
            // Insert media record into database
            await prisma.media.create({
              data: {
                model_name: "listing",
                model_id: listing.listing_id,
                media_url: uniqueFileName,
                media_type: file.mimetype,
                created_at: new Date(),
                updated_at: new Date(),
                media_category: "listing_image",
              },
            });
          }
        }
  
        // Fetch the created listing with all relations
        return await prisma.listing.findUnique({
          where: { listing_id: listing.listing_id },
          include: { room_type: true },
        });
      });
  
      console.log("Transaction completed successfully.");
      res.status(201).json({
        success: true,
        message: "Listing created successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred" });
    }
  };

  export const getAllListings = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const landlord_id = await getLandlordId(req.user.userName);
  
      const listings = await prisma.listing.findMany({
        where: {
          property: {
            landlord_id,
          },
        },
        include: {
          property: true,
          room_type: true,
        },
      });
  
      const listingsWithMedia = await Promise.all(
        listings.map(async (listing) => {
          const media = await prisma.media.findMany({
            where: {
              model_name: 'listing',
              model_id: listing.listing_id,
            },
          });
          return { ...listing, media };
        })
      );
  
      res.status(200).json({
        success: true,
        message: "Listings retrieved successfully",
        data: listingsWithMedia,
      });
    } catch (error) {
      console.error("Error retrieving listings:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving listings" });
    }
  };
  
  export const getListingsForAllUsers = async (req, res) => {
    try {
      const listings = await prisma.listing.findMany({
        include: {
          property: {
            include: {
              landlord: true, // Include landlord details
            },
          },
          room_type: true, // Include room_type details
        },
      });

      const listingsWithMedia = await Promise.all(
        listings.map(async (listing) => {
          const listingMedia = await prisma.media.findMany({
            where: {
              model_name: 'listing',
              model_id: listing.listing_id,
            },
          });
          const propertyWithMedia = await prisma.media.findMany({
            where: {
              model_name: 'property',
              model_id: listing.property.property_id
            }
          })
          listing.property = {...listing.property, media: propertyWithMedia}
          return { ...listing, media: listingMedia };
        })
      );
  
      return res.status(200).json({
        success: true,
        message: "Listings retrieved successfully",
        data: listingsWithMedia,
      });
    } catch (error) {
      console.error("Error retrieving listings:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving listings" });
    }
  }

  export const getListingById = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { id } = req.params;
      const landlord_id = await getLandlordId(req.user.userName);
  
      const listing = await prisma.listing.findUnique({
        where: {
          listing_id: id,
          property: {
            landlord_id,
          },
        },
        include: {
          property: true,
          room_type: true,
        },
      });
  
      if (!listing) {
        return res.status(404).json({ success: false, error: "Listing not found or does not belong to you" });
      }
  
      const media = await prisma.media.findMany({
        where: {
          model_name: 'listing',
          model_id: id,
        },
      });
  
      res.status(200).json({
        success: true,
        message: "Listing retrieved successfully",
        data: { ...listing, media },
      });
    } catch (error) {
      console.error("Error retrieving listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving the listing" });
    }
  };

  export const getListingByIdAdmin = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { id } = req.params;
  
      const listing = await prisma.listing.findUnique({
        where: {
          listing_id: id
        },
        include: {
          property: true,
          room_type: true,
        },
      });
  
      if (!listing) {
        return res.status(404).json({ success: false, error: "Listing not found or does not belong to you" });
      }
  
      const media = await prisma.media.findMany({
        where: {
          model_name: 'listing',
          model_id: id,
        },
      });
  
      res.status(200).json({
        success: true,
        message: "Listing retrieved successfully",
        data: { ...listing, media },
      });
    } catch (error) {
      console.error("Error retrieving listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving the listing" });
    }
  };

  
  export const updateListing = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { id } = req.params; // Listing ID
      const { title, description, status, rent, room_type_id, imagesToDelete } = req.body;
  
      // Get landlord ID to validate ownership
      const landlord_id = await getLandlordId(req.user.userName);
  
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Find the listing and validate ownership
        const listing = await prisma.listing.findUnique({
          where: { listing_id: id },
          include: { property: true },
        });
  
        if (!listing || listing.property.landlord_id !== landlord_id) {
          throw new Error("Listing not found or does not belong to you");
        }
  
        // Update listing details
        const updatedListing = await prisma.listing.update({
          where: { listing_id: id },
          data: {
            title: title || undefined,
            description: description || undefined,
            status: status || undefined,
            rent: rent ? parseFloat(rent) : undefined,
            room_type_id: room_type_id || undefined,
          },
          include: { property: true, room_type: true },
        });
  
        // Handle media deletions
        if (imagesToDelete) {
          const imageIdsToDelete = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
          
          for (const imageId of imageIdsToDelete) {
            const media = await prisma.media.findUnique({ where: { media_id: imageId } });
            
            if (media && media.model_name === "listing" && media.model_id === id) {
              // Delete from S3
              await deleteS3Object(media.media_url);
              // Delete from database
              await prisma.media.delete({ where: { media_id: imageId } });
            }
          }
        }
  
        // Upload new files if provided
        if (req.files && req.files.length > 0) {
          const mediaEntries = await Promise.all(
            req.files.map(async (file) => {
              const uniqueFileName = await uploadToS3(file);
              return {
                media_id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                model_name: "listing",
                model_id: id,
                media_url: uniqueFileName,
                media_type: file.mimetype,
                media_category: "listing_image",
                created_at: new Date(),
                updated_at: new Date(),
              };
            })
          );
  
          await prisma.media.createMany({ data: mediaEntries });
        }
  
        return updatedListing;
      });
  
      // Fetch all associated media for the updated listing
      const media = await prisma.media.findMany({
        where: { model_name: "listing", model_id: id },
      });
  
      res.status(200).json({
        success: true,
        message: "Listing updated successfully",
        data: { ...result, media },
      });
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while updating the listing" });
    }
  };
  
  export const updateListingAdmin = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { id } = req.params; // Listing ID
      const { title, description, status, rent, room_type_id, imagesToDelete } = req.body;
  
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Find the listing and validate ownership
        const listing = await prisma.listing.findUnique({
          where: { listing_id: id },
          include: { property: true },
        });
  
        // Update listing details
        const updatedListing = await prisma.listing.update({
          where: { listing_id: id },
          data: {
            title: title || undefined,
            description: description || undefined,
            status: status || undefined,
            rent: rent ? parseFloat(rent) : undefined,
            room_type_id: room_type_id || undefined,
          },
          include: { property: true, room_type: true },
        });
  
        // Handle media deletions
        if (imagesToDelete) {
          const imageIdsToDelete = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
          
          for (const imageId of imageIdsToDelete) {
            const media = await prisma.media.findUnique({ where: { media_id: imageId } });
            
            if (media && media.model_name === "listing" && media.model_id === id) {
              // Delete from S3
              await deleteS3Object(media.media_url);
              // Delete from database
              await prisma.media.delete({ where: { media_id: imageId } });
            }
          }
        }
  
        // Upload new files if provided
        if (req.files && req.files.length > 0) {
          const mediaEntries = await Promise.all(
            req.files.map(async (file) => {
              const uniqueFileName = await uploadToS3(file);
              return {
                media_id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                model_name: "listing",
                model_id: id,
                media_url: uniqueFileName,
                media_type: file.mimetype,
                media_category: "listing_image",
                created_at: new Date(),
                updated_at: new Date(),
              };
            })
          );
  
          await prisma.media.createMany({ data: mediaEntries });
        }
  
        return updatedListing;
      });
  
      // Fetch all associated media for the updated listing
      const media = await prisma.media.findMany({
        where: { model_name: "listing", model_id: id },
      });
  
      res.status(200).json({
        success: true,
        message: "Listing updated successfully",
        data: { ...result, media },
      });
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while updating the listing" });
    }
  };
  

  export const deleteListing = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { id } = req.params;
      const landlord_id = await getLandlordId(req.user.userName);
  
      const result = await prisma.$transaction(async (prisma) => {
        const listing = await prisma.listing.findUnique({
          where: {
            listing_id: id,
            property: {
              landlord_id,
            },
          },
        });
  
        if (!listing) {
          throw new Error("Listing not found or does not belong to you");
        }
  
        const media = await prisma.media.findMany({
          where: {
            model_name: "listing",
            model_id: id,
          },
        });
  
        if (media.length > 0) {
          const deletePromises = media.map(async (mediaFile) => {
            try {
              await deleteS3Object(mediaFile.media_url);
            } catch (error) {
              console.error(`Error deleting media from S3: ${mediaFile.media_url}`, error);
              throw error;
            }
          });
          await Promise.all(deletePromises);
        }
  
        await prisma.media.deleteMany({
          where: {
            model_name: "listing",
            model_id: id,
          },
        });
  
        await prisma.application.deleteMany({
          where: {
            listing_id: id,
          },
        });
  
        const deletedListing = await prisma.listing.delete({
          where: { listing_id: id },
        });
  
        return deletedListing;
      });
  
      res.status(200).json({
        success: true,
        message: "Listing and all associated data deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while deleting the listing" });
    }
  };

  export const deleteListingAdmin = async (req, res) => {
    try {
      if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }
  
      const { id } = req.params;
  
      const result = await prisma.$transaction(async (prisma) => {
        const listing = await prisma.listing.findUnique({
          where: {
            listing_id: id
          },
        });
  
        if (!listing) {
          throw new Error("Listing not found or does not belong to you");
        }
  
        const media = await prisma.media.findMany({
          where: {
            model_name: "listing",
            model_id: id,
          },
        });
  
        if (media.length > 0) {
          const deletePromises = media.map(async (mediaFile) => {
            try {
              await deleteS3Object(mediaFile.media_url);
            } catch (error) {
              console.error(`Error deleting media from S3: ${mediaFile.media_url}`, error);
              throw error;
            }
          });
          await Promise.all(deletePromises);
        }
  
        await prisma.media.deleteMany({
          where: {
            model_name: "listing",
            model_id: id,
          },
        });
  
        await prisma.application.deleteMany({
          where: {
            listing_id: id,
          },
        });
  
        const deletedListing = await prisma.listing.delete({
          where: { listing_id: id },
        });
  
        return deletedListing;
      });
  
      res.status(200).json({
        success: true,
        message: "Listing and all associated data deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while deleting the listing" });
    }
  };
  
  export const getRoomTypes = async (req, res) => {
    try {
      const roomTypes = await prisma.room_type.findMany();
      res.status(200).json({
        success: true,
        message: "Room types retrieved successfully",
        data: roomTypes,
      });
    } catch (error) {
      console.error("Error retrieving room types:", error);
      res.status(500).json({ success: false, error: "An unexpected error occurred while retrieving room types" });
    }
  };