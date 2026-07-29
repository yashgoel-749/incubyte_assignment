import { forwardRef, type ButtonHTMLAttributes } from 'react';

// ─── Variants ─────────────────────────────────────────────────────────────
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

// ─── Style maps ───────────────────────────────────────────────────────────
const variantStyles: Record<Variant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-slate-700 text-slate-300',
    outline: 'border border-slate-600 hover:border-blue-500 hover:text-blue-400 text-slate-300 bg-transparent',
};

const sizeStyles: Record<Size, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2',
};

// ─── Component ────────────────────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            className = '',
            ...rest
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={[
                    'inline-flex items-center justify-center font-medium',
                    'transition-all duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    variantStyles[variant],
                    sizeStyles[size],
                    className,
                ].join(' ')}
                {...rest}
            >
                {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    },
);

Button.displayName = 'Button';
export default Button;
