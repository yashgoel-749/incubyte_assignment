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

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className={[
                'relative w-full bg-white rounded-xl shadow-xl p-6 transition-all transform scale-100 opacity-100',
                maxWidthMap[maxWidth],
            ].join(' ')}>
                <div className="flex items-center justify-between mb-5">
                    {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
                    <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto p-1.5 !rounded-full shrink-0" aria-label="Close modal">
                        <X size={18} />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}
