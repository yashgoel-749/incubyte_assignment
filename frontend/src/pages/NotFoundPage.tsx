import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { ROUTES } from '../utils/constants';
import { Zap } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 text-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                <Zap size={36} className="text-emerald-500" />
            </div>
            <div>
                <h1 className="text-6xl font-extrabold text-slate-700">404</h1>
                <p className="mt-2 text-xl font-semibold text-slate-300">Page Not Found</p>
                <p className="mt-1 text-sm text-slate-500">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>
            <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary" size="lg">Go to Dashboard</Button>
            </Link>
        </div>
    );
}
