import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all listings with optional filters for address, rent range, and amenities.
 */
export const getAllListings = async (req, res) => {
  try {
    const { address, minRent, maxRent, amenities } = req.query;

    // Base filters object
    const filters = {
      where: {},
      include: {
        property: true, // Include related property details
        amenities: true, // Include related amenities
        landlord: true,  // Include landlord details
        roomType: true,  // Include room type details
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
      filters.where.price = {};
      if (minRent) filters.where.price.gte = parseFloat(minRent);
      if (maxRent) filters.where.price.lte = parseFloat(maxRent);
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = JSON.parse(amenities); // Ensure it's an array
      filters.where.amenities = {
        some: {
          id: {
            in: amenitiesArray,
          },
        },
      };
    }

    // Fetch listings with filters
    const listings = await prisma.listing.findMany(filters);

    // Attach media for each listing's property
    const listingsWithMedia = await Promise.all(
      listings.map(async (listing) => {
        const media = await prisma.media.findMany({
          where: {
            model_id: listing.property_id, // Fetch media associated with the property
            model_name: "property",
          },
        });

        return {
          ...listing,
          Media: media.map((media) => ({
            mediaUrl: media.media_url,
            mediaType: media.media_type,
          })),
        };
      })
    );

    res.status(200).json(listingsWithMedia);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "An error occurred while fetching listings" });
  }
};

/**
 * Get a single listing by ID with all related details.
 */
export const getListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        listing_id: id,
      },
      include: {
        property: true, // Include related property details
        amenities: true, // Include related amenities
        roomType: true, // Include room type details
        landlord: {
          select: {
            name: true,
            contact: true,
          },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Fetch media for the associated property
    const media = await prisma.media.findMany({
      where: {
        model_id: listing.property_id,
        model_name: "property",
      },
    });

    const listingWithMedia = {
      ...listing,
      Media: media.map((media) => ({
        mediaUrl: media.media_url,
        mediaType: media.media_type,
      })),
    };

    res.status(200).json(listingWithMedia);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ error: "An error occurred while fetching the listing" });
  }
};
