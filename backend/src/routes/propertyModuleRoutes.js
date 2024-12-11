import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Router } from 'express';
import { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty } from '../services/propertyModuleService.js';

const router = Router();

/*

// Middleware to mock authentication
const mockAuth = async (req, res, next) => {
  try {
    // Mock fetching an existing user of type LANDLORD
    const existingUser = await prisma.user.findFirst({
      where: { user_type: 'LANDLORD' },
      include: { Landlord: true },
    });

    if (existingUser) {
      req.user_id = existingUser.user_name; // Assign the mock user_id
    } else {
      // Fallback for testing purposes if no landlord exists
      req.user_id = 'test_user_id';
    }

    next();
  } catch (error) {
    console.error("Error in mock authentication:", error);
    res.status(500).json({ success: false, error: "Authentication error" });
  }
};

// Apply mock authentication to all routes
router.use(mockAuth);

*/


router.post('/', createProperty);
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);


export default router;
