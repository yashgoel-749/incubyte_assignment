type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-600 text-white border-blue-600 shadow-sm', // For highlighting tags in the screenshot
};

export default function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
    return (
        <span
            className={[
                'inline-flex items-center justify-center font-semibold border',
                size === 'sm' ? 'px-2 py-0.5 text-[10px] rounded' : 'px-2.5 py-1 text-xs rounded-md',
                variantStyles[variant],
                className,
            ].join(' ')}
        >
            {children}
        </span>
    );
}
