import { createVehicleInDb } from '../repositories/vehicle.repository';
import { CreateVehicleInput } from '../validators/vehicle.schema';

export const createVehicleService = async (data: CreateVehicleInput) => {
    // any business logic goes here
    const vehicle = await createVehicleInDb(data);
    return vehicle;
};
