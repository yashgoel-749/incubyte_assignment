import React from 'react';
import { Card } from '../ui';

interface StatisticsCardProps {
    title: string;
    value: string;
    subtext: string;
    icon: React.ReactNode;
    variant?: 'default' | 'primary';
}

export default function StatisticsCard({ title, value, subtext, icon, variant = 'default' }: StatisticsCardProps) {
    const isPrimary = variant === 'primary';

    return (
        <Card
            className={isPrimary ? 'bg-emerald-700 border-none' : 'bg-white'}
            padding="md"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className={[
                        'text-[11px] font-bold uppercase tracking-wider',
                        isPrimary ? 'text-emerald-200' : 'text-slate-500'
                    ].join(' ')}>
                        {title}
                    </h3>
                    <p className={[
                        'mt-2 text-3xl font-extrabold tracking-tight',
                        isPrimary ? 'text-white' : 'text-slate-900'
                    ].join(' ')}>
                        {value}
                    </p>
                    <p className={[
                        'mt-1.5 text-xs font-medium',
                        isPrimary ? 'text-emerald-100' : 'text-slate-500'
                    ].join(' ')}>
                        {subtext}
                    </p>
                </div>
                <div className={[
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    isPrimary ? 'bg-emerald-600/50 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'
                ].join(' ')}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}
