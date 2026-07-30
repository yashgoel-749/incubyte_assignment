import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm',
};

const sizeStyles: Record<Size, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-sm px-5 py-2.5 rounded-lg gap-2 font-semibold',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, disabled, children, className = '', ...rest
}, ref) => {
    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={[
                'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                variantStyles[variant], sizeStyles[size], className
            ].join(' ')}
            {...rest}
        >
            {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
