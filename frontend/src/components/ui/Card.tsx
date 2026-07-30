import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};

export default function Card({ children, padding = 'md', hoverable = false, className = '', ...rest }: CardProps) {
    return (
        <div
            className={[
                'bg-white border border-slate-200 rounded-xl shadow-sm',
                paddingMap[padding],
                hoverable ? 'hover:shadow-md hover:border-emerald-200 cursor-pointer transition-all duration-200' : '',
                className,
            ].filter(Boolean).join(' ')}
            {...rest}
        >
            {children}
        </div>
    );
}
