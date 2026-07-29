import * as vehicleRepository from '../repositories/vehicle.repository';
import { CreateVehicleInput } from '../validators/vehicle.schema';

export const createVehicle = async (data: CreateVehicleInput) => {
    return await vehicleRepository.create(data);
};
