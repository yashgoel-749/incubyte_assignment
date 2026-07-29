import { useAuth } from '../../hooks';
import { Card } from '../../components/ui';
import { getInitials } from '../../utils/formatters';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-lg space-y-5">
            <h2 className="text-2xl font-bold text-slate-100">Profile</h2>
            <Card className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    {user ? getInitials(user.name) : 'U'}
                </div>
                <div>
                    <p className="text-lg font-semibold text-slate-100">{user?.name ?? '—'}</p>
                    <p className="text-sm text-slate-400">{user?.email ?? '—'}</p>
                    <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">{user?.role ?? '—'}</p>
                </div>
            </Card>
            <Card>
                <p className="text-slate-500 text-sm text-center py-8">
                    Profile edit form — wired in Sprint 3.
                </p>
            </Card>
        </div>
    );
}
