type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    dot?: boolean;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-500/15 text-green-400 border-green-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const dotStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    neutral: 'bg-slate-400',
};

export default function Badge({
    children,
    variant = 'neutral',
    dot = false,
    className = '',
}: BadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center gap-1.5 px-2 py-0.5',
                'text-xs font-medium rounded-full border',
                variantStyles[variant],
                className,
            ].join(' ')}
        >
            {dot && (
                <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`} />
            )}
            {children}
        </span>
    );
}
