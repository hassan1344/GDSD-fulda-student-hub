import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Route to get all properties
router.get('/', async (req, res) => {
  try {
    console.log(req)
    const { address, minRent, maxRent } = req.query;
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

    const properties = await prisma.property.findMany(filters);

    res.status(200).json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'An error occurred while fetching properties' });
  }
});

// Route to get a property by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: {
        property_id: id,
      },
      include: {
        landlord: true, // Include landlord details for the property
        Listing: true,  // Include associated listings for the property
      },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'An error occurred while fetching the property' });
  }
});

export const propertyRoutes = router;
