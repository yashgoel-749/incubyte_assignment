import { Router } from 'express';
import { createVehicle, getVehicles, searchVehicles, updateVehicle, deleteVehicle, purchaseVehicle } from '../controllers/vehicle.controller';
import { validateVehicle, validateUpdateVehicle } from '../middlewares/vehicle.validator';
import { authenticate, authorizeAdmin } from '../middlewares/authenticate';

const router = Router();

router.get('/search', authenticate, searchVehicles);
router.post('/', authenticate, validateVehicle, createVehicle);
router.get('/', authenticate, getVehicles);
router.put('/:id', authenticate, validateUpdateVehicle, updateVehicle);
router.delete('/:id', authenticate, authorizeAdmin, deleteVehicle);
router.post('/:id/purchase', authenticate, purchaseVehicle);

export default router;
