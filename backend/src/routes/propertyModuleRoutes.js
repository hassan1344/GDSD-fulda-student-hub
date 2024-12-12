import { Router } from 'express';
import { authenticateLandlord } from "../middlewares/auth.js";
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateProperty, 
  deleteProperty 
} from '../services/propertyModuleService.js';

const router = Router();

router.post('/', authenticateLandlord, createProperty);
router.get('/', authenticateLandlord, getAllProperties);
router.get('/:id', authenticateLandlord, getPropertyById);
router.put('/:id', authenticateLandlord, updateProperty);
router.delete('/:id', authenticateLandlord, deleteProperty);

export default router;
