import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string | number }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className = '', id, ...rest }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label htmlFor={selectId} className="text-sm font-medium text-slate-700">{label}</label>}
            <div className="relative flex items-center">
                <select
                    ref={ref} id={selectId}
                    className={[
                        'w-full bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-4 appearance-none',
                        'text-slate-900 py-2.5 pl-3 pr-10',
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-500/20',
                        className
                    ].join(' ')}
                    {...rest}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 text-slate-400 pointer-events-none" />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';
export default Select;
