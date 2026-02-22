export interface User {
    id: string;
    email: string;
    name?: string;
    phoneNumber?: string;
    googleId: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}



export interface UserState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
