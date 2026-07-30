import Spinner from './Spinner';

interface LoadingSpinnerProps {
    label?: string;
    className?: string;
}

export default function LoadingSpinner({ label = 'Loading...', className = '' }: LoadingSpinnerProps) {
    return (
        <div className={`py-20 flex justify-center ${className}`}>
            <div className="flex flex-col items-center gap-3 text-slate-500">
                <Spinner size="lg" />
                {label && <p className="text-sm font-medium">{label}</p>}
            </div>
        </div>
    );
}
