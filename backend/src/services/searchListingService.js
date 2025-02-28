import { PrismaClient } from "@prisma/client";
import { getLandlordTrustScore } from "../utils/rentalScoreUtility.js";

const prisma = new PrismaClient();

/**
 * Get all listings with optional filters for address, rent range, and amenities.
 */
export const getAllListings = async (req, res) => {
  try {
    const { address, minRent, maxRent, amenities, roomType } = req.query;

    // Base filters object
    const filters = {
      where: {
        status: "Available",
      },
      include: {
        property: {
          include: {
            landlord: true, // Include the landlord through the property relation
            PropertyAmenity: {
              include: {
                Amenity: true,
              },
            },
          },
        },
        room_type: true,
      },
    };

    // Filter by address (via the related `property` model)
    if (address) {
      filters.where.property = {
        address: {
          contains: address,
        },
      };
    }

    // Filter by rent range
    if (minRent || maxRent) {
      filters.where.rent = {};
      if (minRent) filters.where.rent.gte = parseFloat(minRent);
      if (maxRent) filters.where.rent.lte = parseFloat(maxRent);
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = JSON.parse(amenities);

      console.log(amenitiesArray);

      filters.where.property = {
        ...filters.where.property,
        AND: amenitiesArray.map((amenityName) => ({
          PropertyAmenity: {
            some: {
              Amenity: {
                amenity_name: {
                  contains: amenityName.toLowerCase(),
                },
              },
            },
          },
        })),
      };
    }

    // Filter by room type
    if (roomType) {
      filters.where.room_type = {
        room_type_id: roomType, // Match the room type name
      };
    }

    // Fetch listings with filters
    const listings = await prisma.listing.findMany(filters);

    // Attach media for each listing's property
    const listingsWithExtras = await Promise.all(
      listings.map(async (listing) => {
        const media = await prisma.media.findMany({
          where: {
            OR: [
              { model_id: listing.property_id, model_name: "property" },
              { model_id: listing.listing_id, model_name: "listing" },
            ],
          },
        });

        // Fetch trust score for the landlord
        let trustObj = {};
        if (listing.property.landlord) {
          trustObj = await getLandlordTrustScore(
            listing.property.landlord.landlord_id
          );
        }

        return {
          ...listing,
          Media: media.map((media) => ({
            mediaUrl: media.media_url,
            mediaType: media.media_type,
          })),
          trustScore: trustObj.trustScore, // Append trust score to response
          decisionMessage: trustObj.decisionMessage,
        };
      })
    );

    res.status(200).json(listingsWithExtras);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching listings" });
  }
};

/**
 * Get a single listing by ID with all related details.
 */
export const getListingsByIds = async (req, res) => {
  const { ids } = req.body; // Expecting an array of listing IDs in the request body

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or empty listing IDs array" });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        listing_id: { in: ids }, // Fetch multiple listings
      },
      include: {
        property: {
          include: {
            landlord: true,
            PropertyAmenity: {
              include: {
                Amenity: true,
              },
            },
          },
        },
        room_type: true,
      },
    });

    if (!listings.length) {
      return res.status(404).json({ error: "No listings found" });
    }

    // Fetch media for all properties
    const propertyIds = listings.map((listing) => listing.property_id);
    const media = await prisma.media.findMany({
      where: {
        model_id: { in: propertyIds },
        model_name: "property",
      },
    });

    // Map media to corresponding properties
    const listingsWithMedia = listings.map((listing) => ({
      ...listing,
      Media: media
        .filter((mediaItem) => mediaItem.model_id === listing.property_id)
        .map((mediaItem) => ({
          mediaUrl: mediaItem.media_url,
          mediaType: mediaItem.media_type,
        })),
    }));

    res.status(200).json(listingsWithMedia);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching listings" });
  }
};
