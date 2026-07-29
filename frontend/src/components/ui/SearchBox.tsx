import { Search } from 'lucide-react';
import { type InputHTMLAttributes } from 'react';

export default function SearchBox({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={`relative flex items-center ${className}`}>
            <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
                type="search"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:bg-white inset-m-0"
                {...props}
            />
        </div>
    );
}
