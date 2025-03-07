import { Router } from 'express';
import multer from 'multer';
import { authenticateAdmin, authenticateLandlord } from "../middlewares/auth.js";
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateProperty,
  updatePropertyAdmin,
  deleteProperty,
  deletePropertyAdmin,
  getPropertyByIdAdmin
} from '../services/propertyModuleService.js';

const router = Router();

// Multer setup to handle multiple files in "media" field with maxCount
// Change the Multer configuration to handle media[] field
const upload = multer({ 
  storage: multer.memoryStorage() 
}).array('media[]', 5);  // Accept 'media[]' as field name with max 5 files


router.post('/', authenticateLandlord, upload, createProperty);
router.get('/', authenticateLandlord, getAllProperties);
router.get('/:id', authenticateLandlord, getPropertyById);
router.put('/:id', authenticateLandlord, upload, updateProperty);
router.put('/admin/:id', authenticateAdmin, upload, updatePropertyAdmin);
router.delete('/:id', authenticateLandlord, deleteProperty);
router.delete('/admin/:id', authenticateAdmin, deletePropertyAdmin);

export default router;
