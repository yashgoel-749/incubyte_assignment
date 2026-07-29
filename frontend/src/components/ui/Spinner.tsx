interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function Spinner({ size = 'md', label = 'Loading…' }: SpinnerProps) {
    return (
        <div role="status" className="flex flex-col items-center justify-center gap-3">
            <span
                className={[
                    sizeMap[size],
                    'animate-spin rounded-full',
                    'border-2 border-slate-700 border-t-blue-500',
                ].join(' ')}
            />
            {label && <p className="text-sm text-slate-400">{label}</p>}
            <span className="sr-only">{label}</span>
        </div>
    );
}
