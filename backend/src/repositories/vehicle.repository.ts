import { prisma } from '../config/db';
import { CreateVehicleInput } from '../validators/vehicle.schema';

export const create = async (data: CreateVehicleInput) => {
    return await prisma.vehicle.create({ data });
};
