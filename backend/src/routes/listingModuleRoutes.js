import { Router } from "express";
import multer from "multer";
import { authenticateLandlord } from "../middlewares/auth.js";
import {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
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
router.get('/all', getListingsForAllUsers);
router.get('/room-types', getRoomTypes);
router.get('/:id', authenticateLandlord, getListingById);
router.put('/:id', authenticateLandlord, upload.array("media[]", 5), updateListing);
router.delete('/:id', authenticateLandlord, deleteListing);

export default router;
