import { validate } from './validate';
import { registerSchema, loginSchema } from '../validators/auth.schema';

// ── Exported middleware instances ────────────────────────────────
export const validateRegistration = validate(registerSchema);
export const validateLogin = validate(loginSchema);
