import { Router } from 'express';
import { createVehicle, getVehicles, searchVehicles } from '../controllers/vehicle.controller';
import { validateVehicle } from '../middlewares/vehicle.validator';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.get('/search', authenticate, searchVehicles);
router.post('/', authenticate, validateVehicle, createVehicle);
router.get('/', authenticate, getVehicles);

export default router;
