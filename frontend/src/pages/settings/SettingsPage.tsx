import { Settings } from 'lucide-react';
import { Card } from '../../components/ui';

export default function SettingsPage() {
    return (
        <div className="max-w-xl space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
            <Card className="flex flex-col items-center justify-center py-20 gap-4">
                <Settings size={48} className="text-slate-700 animate-spin-slow" />
                <p className="text-slate-500 text-sm">App settings panel — wired in Sprint 3.</p>
            </Card>
        </div>
    );
}
