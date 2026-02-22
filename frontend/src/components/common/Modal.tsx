'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
    isLoading?: boolean;
    variant?: 'default' | 'destructive';
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    confirmText,
    onConfirm,
    isLoading,
    variant = 'default'
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="flex items-center justify-end space-x-3 p-4 bg-slate-50 border-t">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    {confirmText && (
                        <Button
                            variant={variant === 'destructive' ? 'destructive' : 'default'}
                            onClick={onConfirm}
                            isLoading={isLoading}
                        >
                            {confirmText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
