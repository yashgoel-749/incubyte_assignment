import * as vehicleRepository from '../repositories/vehicle.repository';
import { CreateVehicleInput } from '../validators/vehicle.schema';

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
