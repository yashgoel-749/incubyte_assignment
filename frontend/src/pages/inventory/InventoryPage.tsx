import { Package } from 'lucide-react';
import { Card } from '../../components/ui';

export default function InventoryPage() {
    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Inventory</h2>
            <Card className="flex flex-col items-center justify-center py-20 gap-4">
                <Package size={48} className="text-slate-700" />
                <p className="text-slate-500 text-sm">Inventory view — restock & stock level features wired in Sprint 3.</p>
            </Card>
        </div>
    );
}
