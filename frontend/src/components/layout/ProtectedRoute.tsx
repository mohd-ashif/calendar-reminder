'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/common/Loader';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Only redirect if we have determined the user is definitely not authenticated
        // and we are not in the middle of a loading/verification process
        if (mounted && !loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router, mounted]);

    // Show loader during hydration or while auth state is being verified
    if (!mounted || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
