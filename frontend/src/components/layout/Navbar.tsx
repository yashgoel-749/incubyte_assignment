import { Bell, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../hooks';
import { getInitials } from '../../utils/formatters';
import { SearchBox } from '../ui';

interface NavbarProps { onMenuClick: () => void; }

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-white border-b border-slate-200 px-4 lg:px-8">
            <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-900">
                <Menu size={24} />
            </button>

            <div className="flex-1 max-w-lg">
                <SearchBox placeholder="Search VIN, model or client..." />
            </div>

            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 border-r border-slate-200 pr-4">
                    <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Moon size={18} />
                    </button>
                </div>

                <button className="flex items-center gap-3 text-left">
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || 'Alex Rivera'}</p>
                        <p className="text-xs text-slate-500 mt-1">{user?.role || 'General Manager'}</p>
                    </div>
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                            {getInitials(user?.name || 'Alex Rivera')}
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
}
