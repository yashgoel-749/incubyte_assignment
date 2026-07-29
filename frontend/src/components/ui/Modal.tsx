import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
}: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={[
                    'relative w-full glass-card p-6',
                    maxWidthMap[maxWidth],
                    'animate-[fadeInScale_0.2s_ease]',
                ].join(' ')}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="ml-auto p-1 !rounded-full"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {children}
            </div>
        </div>
    );
}
