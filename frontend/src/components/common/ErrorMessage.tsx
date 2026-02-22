import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-in fade-in zoom-in-95">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{message}</span>
        </div>
    );
};
