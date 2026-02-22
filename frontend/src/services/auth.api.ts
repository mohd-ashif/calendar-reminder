import apiClient from './api.client';
import { APIResponse, User } from '@/types';

export const authApi = {
    verifyToken: async (token: string): Promise<APIResponse<{ user: User }>> => {
        // Send token to backend to verify and get user details
        const response = await apiClient.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('auth_token');
    }
};
