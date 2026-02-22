import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
    return (
        <main className={cn('container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]', className)}>
            {children}
        </main>
    );
};
