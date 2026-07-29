import { Router } from 'express';
import { register } from '../controllers/auth.controller';
import { validateRegistration } from '../middlewares/auth.validator';

const router = Router();

router.post('/register', validateRegistration, register);

export default router;
