import { useParams } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Card } from '../../components/ui';

/** VehicleDetailPage — shows individual vehicle info. API wired in Sprint 3. */
export default function VehicleDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Vehicle Detail</h2>
            <Card className="flex flex-col items-center justify-center py-20 gap-4">
                <Car size={48} className="text-slate-700" />
                <p className="text-slate-500 text-sm">
                    Detail for vehicle <span className="font-mono text-slate-400">{id}</span> loads here.
                </p>
            </Card>
        </div>
    );
}
