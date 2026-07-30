import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicle.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../errors/AppError';

export const createVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
        message: 'Vehicle created successfully',
        vehicle
    });
});

export const getVehicles = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // If any filter query param is present, delegate to searchVehicles so filters are applied.
    const hasFilters = Object.keys(req.query).some(k =>
        ['make', 'model', 'category', 'minPrice', 'maxPrice', 'q'].includes(k) && req.query[k]
    );

    const vehicles = hasFilters
        ? await vehicleService.searchVehicles(req.query)
        : await vehicleService.getVehicles();

    res.status(200).json({
        data: vehicles,
        total: vehicles.length,
        page: 1,
        totalPages: 1
    });
});

export const getVehicleById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        throw new AppError('Vehicle id must be a valid integer', 400);
    }

    const vehicle = await vehicleService.getVehicleById(id);
    res.status(200).json(vehicle);
});

export const searchVehicles = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const vehicles = await vehicleService.searchVehicles(req.query);
    res.status(200).json({ vehicles });
});

// ── Update a vehicle ───────────────────────────────────────────
export const updateVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        throw new AppError('Vehicle id must be a valid integer', 400);
    }

    const vehicle = await vehicleService.updateVehicle(id, req.body);

    res.status(200).json({
        message: 'Vehicle updated successfully',
        vehicle
    });
});

// ── Delete a vehicle ───────────────────────────────────────────
export const deleteVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        throw new AppError('Vehicle id must be a valid integer', 400);
    }

    await vehicleService.deleteVehicle(id);

    res.status(200).json({
        message: 'Vehicle deleted successfully'
    });
});

// ── Purchase a vehicle ─────────────────────────────────────────
export const purchaseVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : 1;

    if (isNaN(id)) {
        throw new AppError('Vehicle id must be a valid integer', 400);
    }
    if (isNaN(quantity) || quantity <= 0) {
        throw new AppError('Quantity must be a positive integer', 400);
    }

    const vehicle = await vehicleService.purchaseVehicle(id, quantity);

    res.status(200).json({
        message: 'Vehicle purchased successfully',
        vehicle,
    });
});

// ── Restock a vehicle ──────────────────────────────────────────
export const restockVehicle = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        throw new AppError('Vehicle id must be a valid integer', 400);
    }

    const vehicle = await vehicleService.restockVehicle(id);

    res.status(200).json({
        message: 'Vehicle restocked successfully',
        vehicle,
    });
});
