import { Request, Response, NextFunction } from 'express';
import { createVehicleSchema } from '../validators/vehicle.schema';

export const validateVehicle = (req: Request, res: Response, next: NextFunction): void => {
    const result = createVehicleSchema.safeParse(req.body);

    if (!result.success) {
        const firstIssue = result.error.issues[0];
        res.status(400).json({ error: firstIssue.message });
        return;
    }

    req.body = result.data;
    next();
};
