interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    className?: string;
}
const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function Spinner({ size = 'md', label, className = '' }: SpinnerProps) {
    return (
        <div role="status" className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <span className={[
                sizeMap[size],
                'animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600'
            ].join(' ')} />
            {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
            <span className="sr-only">{label || 'Loading...'}</span>
        </div>
    );
}
