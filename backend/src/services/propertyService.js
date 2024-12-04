import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProperties = async (req, res) => {
  try {
    // console.log(req.query);
    const { address, minRent, maxRent, amenities } = req.query;
    const filters = {
      where: {},
      include: {
        landlord: true, // Include landlord details
      },
    };

    if (address) {
      filters.where.address = {
        contains: address, // Search for properties with the address containing the query
      };
    }

    if (minRent || maxRent) {
      filters.where.rent = {};
      if (minRent) filters.where.rent.gte = parseFloat(minRent); // Greater than or equal to minRent
      if (maxRent) filters.where.rent.lte = parseFloat(maxRent); // Less than or equal to maxRent
    }

    if (amenities) {
      let amenitiesArray = JSON.parse(amenities);

      filters.where.amenities = {
        array_contains: amenitiesArray,
      };
    }

    const properties = await prisma.property.findMany(filters);

    const propertiesWithMedia = await Promise.all(
      properties.map(async (property) => {
        const media = await prisma.media.findMany({
          where: {
            model_id: property.property_id,
            model_name: "property", // Ensure it is related to a property
          },
        });

        return {
          ...property,
          Media: media.map((media) => ({
            mediaUrl: media.media_url,
            mediaType: media.media_type,
          })),
        };
      })
    );

    res.status(200).json(propertiesWithMedia);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching properties" });
  }
};

export const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: {
        property_id: id,
      },
      include: {
        landlord: true, // Include landlord details for the property
        // Listing: true,  // Include associated listings for the property
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const media = await prisma.media.findMany({
      where: {
        model_id: property.property_id,
        model_name: "property", // Ensure it is related to a property
      },
    });

    const propertyWithMedia = {
      ...property,
      Media: media.map((media) => ({
        mediaUrl: media.media_url,
        mediaType: media.media_type,
      })),
    };

    res.status(200).json(propertyWithMedia);
  } catch (error) {
    console.error("Error fetching property:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the property" });
  }
};
