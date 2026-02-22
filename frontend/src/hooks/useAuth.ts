import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setAuth, logout, setLoading, setError } from '@/store/slices/auth.slice';
import { authApi } from '@/services/auth.api';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, isAuthenticated, loading, error } = useAppSelector((state: RootState) => state.auth);

    const loginWithGoogle = useCallback(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/auth/google`;
    }, []);

    const handleLogout = useCallback(() => {
        authApi.logout();
        dispatch(logout());
        router.push('/');
    }, [dispatch, router]);

    const verifyAuth = useCallback(async (token: string) => {
        dispatch(setLoading(true));
        try {
            const response = await authApi.verifyToken(token);
            if (response.success && response.data) {
                dispatch(setAuth({ user: response.data.user, token }));
                return true;
            }
            dispatch(setError(response.message || 'Authentication failed'));
            return false;
        } catch (err: any) {
            dispatch(setError(err.message));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        loginWithGoogle,
        handleLogout,
        verifyAuth,
    };
};
