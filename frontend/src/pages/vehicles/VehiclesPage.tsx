import { Car } from 'lucide-react';
import { Card } from '../../components/ui';

/** VehiclesPage — full list/search view. API connection in Sprint 3. */
export default function VehiclesPage() {
    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Vehicles</h2>
            <Card className="flex flex-col items-center justify-center py-20 gap-4">
                <Car size={48} className="text-slate-700" />
                <p className="text-slate-500 text-sm">Vehicle list loads here — wire to vehicleService.getAll() in Sprint 3.</p>
            </Card>
        </div>
    );
}
