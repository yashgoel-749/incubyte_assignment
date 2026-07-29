import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicle.service';
import { catchAsync } from '../utils/catchAsync';

export const createVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
        message: 'Vehicle created successfully',
        vehicle
    });
});
