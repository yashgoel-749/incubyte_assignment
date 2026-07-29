import { validate } from './validate';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.schema';

// ── Exported middleware instances ────────────────────────────────
export const validateVehicle = validate(createVehicleSchema);
export const validateUpdateVehicle = validate(updateVehicleSchema);
