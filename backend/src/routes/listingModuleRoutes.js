import { Router } from "express";
import multer from "multer";
import { authenticateLandlord, authenticateAdmin } from "../middlewares/auth.js";
import {
    createListing,
    getAllListings,
    getListingById,
    getListingByIdAdmin,
    updateListing,
    updateListingAdmin,
    deleteListing,
    deleteListingAdmin,
    getRoomTypes,
    getListingsForAllUsers
  } from '../services/listingModuleService.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for direct S3 upload
const upload = multer({
  storage,
  limits: {
    files: 5, // Limit to a maximum of 5 files
  },
});

// Route for creating a listing with file uploads
router.post("/", authenticateLandlord, upload.array("media[]", 5), createListing);
router.get('/', authenticateLandlord, getAllListings);
router.get('/all', authenticateAdmin, getListingsForAllUsers);
router.get('/room-types', getRoomTypes);
router.get('/:id', authenticateLandlord, getListingById);
router.get('/admin/:id', authenticateAdmin, getListingByIdAdmin);
router.put('/:id', authenticateLandlord, upload.array("media[]", 5), updateListing);
router.put('/admin/:id', authenticateAdmin, upload.array("media[]", 5), updateListingAdmin);
router.delete('/:id', authenticateLandlord, deleteListing);
router.delete('/admin/:id', authenticateAdmin, deleteListingAdmin);

export default router;
