import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, helperText, leftAdornment, rightAdornment, className = '', id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label htmlFor={inputId} className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</label>}
            <div className="relative flex items-center">
                {leftAdornment && (
                    <span className="absolute left-3 text-slate-400 pointer-events-none">
                        {leftAdornment}
                    </span>
                )}
                <input
                    ref={ref} id={inputId}
                    className={[
                        'w-full bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-4',
                        'text-slate-900 placeholder:text-slate-400 py-2.5',
                        leftAdornment ? 'pl-9' : 'pl-3',
                        rightAdornment ? 'pr-9' : 'pr-3',
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-500/20',
                        className
                    ].join(' ')}
                    {...rest}
                />
                {rightAdornment && (
                    <span className="absolute right-3 text-slate-400">
                        {rightAdornment}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
