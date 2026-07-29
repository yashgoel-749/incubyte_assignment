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

export const getVehicles = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const vehicles = await vehicleService.getVehicles();
    res.status(200).json({ vehicles });
});

export const searchVehicles = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const vehicles = await vehicleService.searchVehicles(req.query);
    res.status(200).json({ vehicles });
});
