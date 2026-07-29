import * as vehicleRepository from '../repositories/vehicle.repository';
import { CreateVehicleInput, UpdateVehicleInput } from '../validators/vehicle.schema';
import { AppError } from '../errors/AppError';

export const createVehicle = async (data: CreateVehicleInput) => {
    return await vehicleRepository.create(data);
};

export const getVehicles = async () => {
    return await vehicleRepository.findAll();
};

export const searchVehicles = async (query: any) => {
    const filters: any = {
        make: query.make,
        model: query.model,
        category: query.category,
    };

    if (query.minPrice) filters.minPrice = parseFloat(query.minPrice);
    if (query.maxPrice) filters.maxPrice = parseFloat(query.maxPrice);

    return await vehicleRepository.findByFilters(filters);
};

// ── Update a vehicle with 404 guard ─────────────────────────────
export const updateVehicle = async (id: number, data: UpdateVehicleInput) => {
    const existing = await vehicleRepository.findById(id);
    if (!existing) {
        throw new AppError(`Vehicle with id ${id} not found`, 404);
    }
    return await vehicleRepository.update(id, data);
};

// ── Delete a vehicle with 404 guard ─────────────────────────────
export const deleteVehicle = async (id: number) => {
    const existing = await vehicleRepository.findById(id);
    if (!existing) {
        throw new AppError(`Vehicle with id ${id} not found`, 404);
    }
    return await vehicleRepository.deleteById(id);
};
