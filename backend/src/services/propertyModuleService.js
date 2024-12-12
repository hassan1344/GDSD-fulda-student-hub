import { PrismaClient, Prisma } from "@prisma/client";

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

    // Ensure amenities is an array
    if (!Array.isArray(amenities)) {
      return res.status(400).json({ success: false, error: "Amenities must be an array" });
    }

    const landlord_id = await getLandlordId(req.user.userName);
    console.log("createProperty called with landlord_id:", landlord_id);

    const property = await prisma.property.create({
      data: {
        landlord_id,
        address,
        rent: parseFloat(rent),
        amenities, // Use amenities directly as it's already an array
      },
      include: { landlord: true },
    });

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
    console.log("Request to update property for user:", req.user); // Log user info

    if (!req.user || !req.user.userName) {
      console.log("User not authenticated:", req.user); // Log user object
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const { id } = req.params;
    const { address, rent, amenities } = req.body;

    // Log the incoming request body
    console.log("Incoming update data:", req.body);

    const landlord_id = await getLandlordId(req.user.userName);
    console.log("updateProperty called with landlord_id:", landlord_id);

    const updateData = {};
    if (address) updateData.address = address;
    if (rent) updateData.rent = parseFloat(rent);
    
    // Use amenities directly as it's already an array
    if (amenities) {
      if (!Array.isArray(amenities)) {
        return res.status(400).json({ success: false, error: "Amenities must be an array" });
      }
      updateData.amenities = amenities; // Use amenities directly
    }

    const updatedProperty = await prisma.property.update({
      where: { property_id: id, landlord_id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error.message, error.stack);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    if (error.message === "Associated landlord profile not found") {
      return res.status(404).json({ success: false, error: "Landlord profile not found" });
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred while updating the property" });
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

     const deletedProperty = await prisma.property.delete({
       where: { property_id: id, landlord_id },
     });

     res.status(200).json({
       success: true,
       message: "Property deleted successfully",
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
