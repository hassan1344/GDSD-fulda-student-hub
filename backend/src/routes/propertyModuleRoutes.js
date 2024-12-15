import { Router } from 'express';
import multer from 'multer';
import { authenticateLandlord } from "../middlewares/auth.js";
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateProperty, 
  deleteProperty 
} from '../services/propertyModuleService.js';

const router = Router();

// Multer setup to handle multiple files in "media" field
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateLandlord, upload.array('media'), createProperty);
router.get('/', authenticateLandlord, getAllProperties);
router.get('/:id', authenticateLandlord, getPropertyById);
router.put('/:id', authenticateLandlord, upload.array('media'), updateProperty);
router.delete('/:id', authenticateLandlord, deleteProperty);

export default router;
