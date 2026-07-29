import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, leftAdornment, rightAdornment, className = '', id, ...rest }, ref) => {
        const inputId = id ?? `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
                        {label}
                    </label>
                )}

                <div className="relative flex items-center">
                    {leftAdornment && (
                        <span className="absolute left-3 text-slate-400 pointer-events-none">
                            {leftAdornment}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={[
                            'w-full bg-slate-800 border rounded-lg',
                            'text-slate-100 placeholder:text-slate-500',
                            'text-sm py-2.5 transition-all duration-200',
                            leftAdornment ? 'pl-10' : 'pl-4',
                            rightAdornment ? 'pr-10' : 'pr-4',
                            error
                                ? 'border-red-500 focus:ring-red-500/30'
                                : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500/20',
                            'focus:outline-none focus:ring-2',
                            className,
                        ].join(' ')}
                        {...rest}
                    />

                    {rightAdornment && (
                        <span className="absolute right-3 text-slate-400">
                            {rightAdornment}
                        </span>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-xs text-slate-500">{helperText}</p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';
export default Input;
