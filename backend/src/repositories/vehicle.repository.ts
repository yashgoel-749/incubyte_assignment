import { prisma } from '../config/db';
import { CreateVehicleInput, UpdateVehicleInput } from '../validators/vehicle.schema';
import { AppError } from '../errors/AppError';

export const create = async (data: CreateVehicleInput) => {
    return await prisma.vehicle.create({ data });
};

export const findAll = async () => {
    return await prisma.vehicle.findMany();
};

export const findByFilters = async (filters: any) => {
    const where: any = {};

    // Global free-text search (from Navbar) — matches make OR model
    if (filters.q) {
        where.OR = [
            { make: { contains: filters.q, mode: 'insensitive' } },
            { model: { contains: filters.q, mode: 'insensitive' } },
        ];
    }

    // Field-level filters — case-insensitive contains for make/model, exact for category
    if (filters.make) where.make = { contains: filters.make, mode: 'insensitive' };
    if (filters.model) where.model = { contains: filters.model, mode: 'insensitive' };
    if (filters.category) where.category = filters.category;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    return await prisma.vehicle.findMany({ where });
};

// ── Find a single vehicle by primary key (──────────────────────
export const findById = async (id: number) => {
    return await prisma.vehicle.findUnique({ where: { id } });
};

// ── Update a vehicle by primary key ────────────────────────
export const update = async (id: number, data: UpdateVehicleInput) => {
    return await prisma.vehicle.update({ where: { id }, data });
};

// ── Delete a vehicle by primary key ────────────────────────
// ── Delete a vehicle by primary key ────────────────────────
export const deleteById = async (id: number) => {
    return await prisma.vehicle.delete({ where: { id } });
};

// ── Purchase a vehicle (Atomic) ────────────────────────────
export const purchase = async (id: number, quantity: number) => {
    return await prisma.$transaction(async (tx: any) => {
        const vehicle = await tx.vehicle.findUnique({ where: { id } });
        if (!vehicle) {
            throw new AppError(`Vehicle with id ${id} not found`, 404);
        }
        if (vehicle.stock < quantity) {
            throw new AppError('Vehicle is out of stock or insufficient quantity', 400);
        }

        const newStock = vehicle.stock - quantity;
        return await tx.vehicle.update({
            where: { id },
            data: {
                stock: newStock,
                status: newStock === 0 ? 'SOLD' : vehicle.status
            },
        });
    });
};

// ── Restock a vehicle (Atomic) ─────────────────────────────
export const restock = async (id: number) => {
    return await prisma.$transaction(async (tx: any) => {
        const vehicle = await tx.vehicle.findUnique({ where: { id } });
        if (!vehicle) {
            throw new AppError(`Vehicle with id ${id} not found`, 404);
        }
        return await tx.vehicle.update({
            where: { id },
            data: { status: 'AVAILABLE' },
        });
    });
};
