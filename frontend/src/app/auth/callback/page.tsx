'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/common/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyAuth, error } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;

        const token = searchParams.get('token');

        if (token) {
            processed.current = true;
            verifyAuth(token).then((success) => {
                if (success) {
                    router.push('/dashboard');
                }
            });
        } else if (!token && !processed.current) {
            // Handle case where no token is present
            // router.push('/');
        }
    }, [searchParams, verifyAuth, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle>Authenticating...</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                    {error ? (
                        <div className="text-destructive text-center">
                            <p className="font-semibold">Authentication Failed</p>
                            <p className="text-sm mt-1">{error}</p>
                            <button
                                onClick={() => router.push('/')}
                                className="mt-4 text-primary hover:underline text-sm font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    ) : (
                        <>
                            <Loader size={40} className="mb-4" />
                            <p className="text-slate-600">Please wait while we complete your sign-in.</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
