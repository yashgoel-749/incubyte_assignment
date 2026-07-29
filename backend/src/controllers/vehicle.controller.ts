import { Request, Response } from 'express';
import { createVehicleService } from '../services/vehicle.service';
import { catchAsync } from '../utils/catchAsync';

export const createVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const vehicle = await createVehicleService(req.body);

    res.status(201).json({
        message: 'Vehicle created successfully',
        vehicle
    });
});
