import { prisma } from '../config/db';
import { CreateVehicleInput } from '../validators/vehicle.schema';

export const create = async (data: CreateVehicleInput) => {
    return await prisma.vehicle.create({ data });
};

export const findAll = async () => {
    return await prisma.vehicle.findMany();
};

export const findByFilters = async (filters: any) => {
    const where: any = {};
    if (filters.make) where.make = filters.make;
    if (filters.model) where.model = filters.model;
    if (filters.category) where.category = filters.category;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    return await prisma.vehicle.findMany({ where });
};
