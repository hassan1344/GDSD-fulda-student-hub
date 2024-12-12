// File: src/services/propertyModuleService.js

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

export const createProperty = async (req, res) => {
  try {
    const { address, rent, amenities } = req.body;
    const landlord_id = req.landlord_id;

    const landlordExists = await prisma.landlord.findUnique({
      where: { landlord_id }
    });

    if (!landlordExists) {
      return res.status(404).json({ success: false, error: "Landlord not found" });
    }

    const property = await prisma.property.create({
      data: {
        landlord_id,
        address,
        rent: parseFloat(rent),
        amenities,
      },
      include: { landlord: true },
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("❌ Error creating property:", error.message, error.stack);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Landlord not found" });
      } else if (error.code === 'P2003') {
        return res.status(400).json({ success: false, error: "Foreign key constraint failed" });
      }
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred" });
  }
};

export const getAllProperties = async (req, res) => {
  const landlord_id = req.landlord_id;

  try {
    const properties = await prisma.property.findMany({
      where: { landlord_id },
      include: {
        landlord: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    console.error("❌ Error retrieving properties:", error.message, error.stack);
    res.status(500).json({ success: false, error: "An unexpected error occurred" });
  }
};

export const getPropertyById = async (req, res) => {
  const { id } = req.params;
  const landlord_id = req.landlord_id;

  try {
    const property = await prisma.property.findUnique({
      where: { property_id: id, landlord_id },
      include: {
        landlord: true,
      },
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
    console.error("❌ Error retrieving property:", error.message, error.stack);
    res.status(500).json({ success: false, error: "An unexpected error occurred" });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const landlord_id = req.landlord_id;

  try {
    const { address, rent, amenities } = req.body;
    const updateData = {};

    if (address) updateData.address = address;
    if (rent) updateData.rent = parseFloat(rent);
    if (amenities) updateData.amenities = amenities;

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
    console.error("❌ Error updating property:", error.message, error.stack);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Property not found" });
      }
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred" });
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const landlord_id = req.landlord_id;

  try {
    const deletedProperty = await prisma.property.delete({
      where: { property_id: id, landlord_id },
    });

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      data: deletedProperty,
    });
  } catch (error) {
    console.error("❌ Error deleting property:", error.message, error.stack);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ success: false, error: "Property not found" });
      }
    }
    res.status(500).json({ success: false, error: "An unexpected error occurred" });
  }
};
