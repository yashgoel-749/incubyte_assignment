import { validate } from './validate';
import { createVehicleSchema } from '../validators/vehicle.schema';

// ── Exported middleware instances ────────────────────────────────
export const validateVehicle = validate(createVehicleSchema);
