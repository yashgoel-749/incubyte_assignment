import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validateRegistration, validateLogin } from '../middlewares/auth.validator';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);

export default router;
