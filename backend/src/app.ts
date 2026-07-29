import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// ── Global Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health Check ────────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Centralized Error Handler (must be registered LAST) ─────────
app.use(errorHandler);

export default app;
