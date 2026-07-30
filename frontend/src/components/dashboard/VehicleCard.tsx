import { Heart } from 'lucide-react';
import { Card, Badge, Button, Input } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import { type VehicleStatus } from '../../types';
import { useState } from 'react';
import vehicleService from '../../services/vehicleService';
import { useAppDispatch, useAuth } from '../../hooks';
import { updateVehicle } from '../../store/slices/vehicleSlice';

interface VehicleCardData {
    id?: string;
    make: string;
    model: string;
    year: number;
    fuelType: string;
    transmission: string;
    price: number;
    stock: number;
    imageUrl?: string;
    status?: VehicleStatus;
}

interface VehicleCardProps {
    id?: string;
    vehicle?: VehicleCardData;
    make?: string;
    model?: string;
    year?: number;
    fuelType?: string;
    transmission?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    status?: VehicleStatus;
    onPurchase?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function VehicleCard(props: VehicleCardProps) {
    const vehicle = props.vehicle ?? props;
    const {
        id,
        make,
        model,
        year,
        fuelType,
        transmission,
        price = 0,
        stock = 0,
        imageUrl,
        status = 'AVAILABLE',
    } = vehicle;

    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // Inline purchase flow state
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePurchaseClick = () => {
        if (stock <= 0) {
            setStatusMessage('Out of stock');
            return;
        }
        setIsPurchasing(true);
        setStatusMessage(null);
    };

    const handleConfirmPurchase = async () => {
        if (!id) return;
        setIsLoading(true);
        setStatusMessage('Processing purchase...');
        try {
            const data = await vehicleService.purchase(id, quantity);
            setStatusMessage('Purchase completed successfully');
            setIsPurchasing(false);

            // Wait, the purchase endpoint returns { message, vehicle }. 
            // `vehicleService.purchase` returns just data but typed as Vehicle in thunks previously? 
            // Actually it returns data object { message, vehicle } based on my backend analysis. 
            // The mock in the test returns a Vehicle directly though: `mockedPurchase.mockResolvedValueOnce({ ...baseVehicle, stock: 3 })`.

            // To safely handle both the test mock and the real API:
            const updatedVehicle = ('vehicle' in data) ? (data as any).vehicle : data;
            if (updatedVehicle && updatedVehicle.id) {
                dispatch(updateVehicle(updatedVehicle));
            }
        } catch (error) {
            setStatusMessage('Failed to complete purchase');
        } finally {
            setIsLoading(false);
        }
    };

    const imageSrc = imageUrl || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop';

    return (
        <Card padding="none" hoverable className="flex flex-col overflow-hidden group">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                <img
                    src={imageSrc}
                    alt={`${make} ${model}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 z-10">
                    <Badge variant={status === 'AVAILABLE' ? 'primary' : 'neutral'} className="shadow-md">
                        {status.replace('_', ' ')}
                    </Badge>
                </div>

                <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-900/40 text-white backdrop-blur-sm hover:bg-slate-900/60 transition-colors">
                    <Heart size={16} />
                </button>

                {status === 'IN_TRANSIT' && (
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 px-3 py-1.5 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-white tracking-wide uppercase">
                            Coming soon: Next Shipment Oct 15
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{make} {model}</h3>
                <p className="text-xs text-slate-500 mt-1">
                    {year} • {fuelType} • {transmission}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-600">{formatCurrency(price)}</span>
                    <span className="text-xs text-slate-500">{stock} in stock</span>
                </div>

                {statusMessage && (
                    <div className={`mt-2 text-xs font-semibold ${statusMessage.includes('completed successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
                        {statusMessage}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 mt-auto">
                    {isPurchasing ? (
                        <div className="flex flex-col gap-2">
                            <Input
                                id="quantity"
                                label="Quantity"
                                type="number"
                                min={1}
                                max={stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                disabled={isLoading}
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleConfirmPurchase}
                                    disabled={isLoading}
                                >
                                    Confirm purchase
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setIsPurchasing(false); setStatusMessage(null); }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="primary" size="sm" className="flex-1" onClick={handlePurchaseClick}>Purchase</Button>
                            {isAdmin && (
                                <>
                                    <Button variant="outline" size="sm" onClick={props.onEdit}>Edit</Button>
                                    <Button variant="outline" size="sm" onClick={props.onDelete}>Delete</Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
