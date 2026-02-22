import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setUserLoading, setUserSuccess, setUserError, resetUserStatus } from '@/store/slices/user.slice';
import { userApi } from '@/services/user.api';
import { useCallback, useState } from 'react';
import { setAuth } from '@/store/slices/auth.slice';
import { RootState } from '@/store';

export const useUser = () => {
    const dispatch = useAppDispatch();
    const { loading, error, success } = useAppSelector((state: RootState) => state.user);
    const { user, token } = useAppSelector((state: RootState) => state.auth);
    const [logs, setLogs] = useState<any[]>([]);

    const fetchLogs = useCallback(async () => {
        try {
            const response = await userApi.getLogs();
            if (response.success && response.data) {
                setLogs(response.data.logs);
            }
        } catch (err: any) {
            console.error('Failed to fetch logs', err);
        }
    }, []);

    const updatePhone = useCallback(async (phoneNumber: string) => {
        dispatch(setUserLoading(true));
        try {
            const response = await userApi.updatePhoneNumber(phoneNumber);
            if (response.success && response.data) {
                dispatch(setUserSuccess(true));
                if (token) {
                    dispatch(setAuth({ user: response.data.user, token }));
                }
                // Refresh logs after update
                fetchLogs();
                return true;
            }
            return false;
        } catch (err: any) {
            dispatch(setUserError(err.message));
            return false;
        } finally {
            dispatch(setUserLoading(false));
        }
    }, [dispatch, token, fetchLogs]);

    const clearStatus = useCallback(() => {
        dispatch(resetUserStatus());
    }, [dispatch]);

    return {
        user,
        loading,
        error,
        success,
        logs,
        updatePhone,
        fetchLogs,
        clearStatus,
    };
};
