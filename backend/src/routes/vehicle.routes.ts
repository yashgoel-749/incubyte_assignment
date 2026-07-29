import { Router } from 'express';
import { createVehicle } from '../controllers/vehicle.controller';
import { validateVehicle } from '../middlewares/vehicle.validator';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post('/', authenticate, validateVehicle, createVehicle);

export default router;
