import apiClient from './api.client';
import { APIResponse, User } from '@/types';

export const userApi = {
    getProfile: async (): Promise<APIResponse<{ user: User }>> => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },
    updatePhoneNumber: async (phoneNumber: string): Promise<APIResponse<{ user: User }>> => {
        const response = await apiClient.post('/user/phone', { phoneNumber });
        return response.data;
    },
    getLogs: async (): Promise<APIResponse<{ logs: any[] }>> => {
        const response = await apiClient.get('/user/logs');
        return response.data;
    },
};
