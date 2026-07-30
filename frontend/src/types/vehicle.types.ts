// ─── Vehicle Domain Types ──────────────────────────────────────────────────

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type Transmission = 'Automatic' | 'Manual';
export type VehicleStatus = 'AVAILABLE' | 'SOLD' | 'IN_TRANSIT' | 'RESERVED';

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    stock: number;
    fuelType: FuelType;
    transmission: Transmission;
    status: VehicleStatus;
    imageUrl?: string;
    description?: string;
    vin?: string;
    mileage?: number;
    color?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleFilters {
    // Field-level filters
    make?: string;
    model?: string;
    category?: string;
    // Global free-text search (Navbar)
    q?: string;
    // Price range
    minPrice?: number;
    maxPrice?: number;
    // Legacy / sorting
    search?: string;
    status?: VehicleStatus;
    fuelType?: FuelType;
    page?: number;
    limit?: number;
    sortBy?: 'price' | 'year' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface VehiclePaginatedResponse {
    data: Vehicle[];
    total: number;
    page: number;
    totalPages: number;
}

export interface VehicleState {
    vehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
    total: number;
    page: number;
    totalPages: number;
    filters: VehicleFilters;
    isLoading: boolean;
    error: string | null;
    globalSearch: string;
}

export interface CreateVehicleDto {
    make: string;
    model: string;
    year: number;
    price: number;
    stock: number;
    fuelType: FuelType;
    transmission: Transmission;
    imageUrl?: string;
    description?: string;
    vin?: string;
    mileage?: number;
    color?: string;
}
