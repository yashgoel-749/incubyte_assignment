import { ShoppingCart } from 'lucide-react';
import { Card } from '../../components/ui';

export default function PurchasesPage() {
    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Purchases</h2>
            <Card className="flex flex-col items-center justify-center py-20 gap-4">
                <ShoppingCart size={48} className="text-slate-700" />
                <p className="text-slate-500 text-sm">Purchase history and transaction log — wired in Sprint 3.</p>
            </Card>
        </div>
    );
}
