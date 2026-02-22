'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { verifyAuth } = useAuth();
    const initialized = useRef(false);

    useEffect(() => {
        // On first mount, attempt to verify any existing token
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token && !initialized.current) {
            initialized.current = true;
            verifyAuth(token);
        }

        // Listen for token changes in other tabs/windows and verify when set
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'auth_token' && e.newValue) {
                verifyAuth(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [verifyAuth]);

    return <>{children}</>;
}
