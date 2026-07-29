import { Heart } from 'lucide-react';
import { Card, Badge, Button } from '../ui';
import { formatCurrency } from '../../utils/formatters';

interface VehicleCardProps {
    make: string;
    model: string;
    year: number;
    fuelType: string;
    transmission: string;
    price: number;
    stock: number;
    imageUrl?: string;
    statusStatus?: 'AVAILABLE' | 'IN_TRANSIT' | 'SOLD';
    onPurchase?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function VehicleCard({
    make, model, year, fuelType, transmission, price, stock, imageUrl, statusStatus = 'AVAILABLE',
    onPurchase, onEdit, onDelete
}: VehicleCardProps) {
    // Use a placeholder if NO imageUrl is provided.
    const imageSrc = imageUrl || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop';

    return (
        <Card padding="none" hoverable className="flex flex-col overflow-hidden group">
            {/* Top Image Box */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                <img
                    src={imageSrc}
                    alt={`${make} ${model}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <Badge variant={statusStatus === 'AVAILABLE' ? 'primary' : 'neutral'} className="shadow-md">
                        {statusStatus.replace('_', ' ')}
                    </Badge>
                </div>

                {/* Favorite Icon */}
                <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-900/40 text-white backdrop-blur-sm hover:bg-slate-900/60 transition-colors">
                    <Heart size={16} />
                </button>

                {/* Overlay banner for in-transit mapping exactly to the screenshot's 'Coming soon' text */}
                {statusStatus === 'IN_TRANSIT' && (
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 px-3 py-1.5 backdrop-blur-sm">
                        <p className="text-[10px] font-bold text-white tracking-wide uppercase">
                            Coming soon: Next Shipment Oct 15
                        </p>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{make} {model}</h3>
                <p className="text-xs text-slate-500 mt-1">
                    {year} • {fuelType} • {transmission}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(price)}</span>
                    <span className="text-xs text-slate-500">{stock} in stock</span>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 mt-auto">
                    <Button variant="primary" size="sm" className="flex-1" onClick={onPurchase}>Purchase</Button>
                    <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={onDelete}>Delete</Button>
                </div>
            </div>
        </Card>
    );
}
