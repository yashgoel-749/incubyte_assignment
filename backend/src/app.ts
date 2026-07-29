import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

// API Routes
app.use('/api/auth', authRoutes);

export default app;
