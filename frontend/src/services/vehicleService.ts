import apiClient from './api';
import type {
    Vehicle,
    CreateVehicleDto,
    VehicleFilters,
    VehiclePaginatedResponse,
} from '../types';

/**
 * vehicleService — thin facade over /vehicles endpoints.
 */
const vehicleService = {
    /** GET /vehicles  — with optional query filters */
    async getAll(filters?: VehicleFilters): Promise<VehiclePaginatedResponse> {
        const { data } = await apiClient.get<VehiclePaginatedResponse>('/vehicles', {
            params: filters,
        });
        return data;
    },

    /** GET /vehicles/:id */
    async getById(id: string): Promise<Vehicle> {
        const { data } = await apiClient.get<Vehicle>(`/vehicles/${id}`);
        return data;
    },

    /** POST /vehicles  (Admin / Manager only) */
    async create(dto: CreateVehicleDto): Promise<Vehicle> {
        const { data } = await apiClient.post<Vehicle>('/vehicles', dto);
        return data;
    },

    /** PUT /vehicles/:id  (Admin / Manager only) */
    async update(id: string, dto: Partial<CreateVehicleDto>): Promise<Vehicle> {
        const { data } = await apiClient.put<Vehicle>(`/vehicles/${id}`, dto);
        return data;
    },

    /** DELETE /vehicles/:id  (Admin only) */
    async remove(id: string): Promise<void> {
        await apiClient.delete(`/vehicles/${id}`);
    },

    /** POST /vehicles/:id/purchase */
    async purchase(id: string, quantity: number): Promise<Vehicle> {
        const { data } = await apiClient.post<Vehicle>(`/vehicles/${id}/purchase`, { quantity });
        return data;
    },

    /** POST /vehicles/:id/restock  (Admin / Manager only) */
    async restock(id: string, quantity: number): Promise<Vehicle> {
        const { data } = await apiClient.post<Vehicle>(`/vehicles/${id}/restock`, { quantity });
        return data;
    },
};

export default vehicleService;
