import Modal from './Modal';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export default function ConfirmationDialog({
    isOpen, onClose, onConfirm, title, description,
    confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false, isLoading = false
}: ConfirmationDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
            <div className="flex items-start gap-4">
                <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <AlertCircle size={24} />
                </div>
                <div className="pt-1 w-full">
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 w-full">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
                <Button
                    variant={isDestructive ? 'danger' : 'primary'}
                    onClick={onConfirm}
                    isLoading={isLoading}
                >
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
}
