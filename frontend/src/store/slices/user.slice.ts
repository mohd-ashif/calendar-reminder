import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/types';

const initialState: UserState = {
    loading: false,
    error: null,
    success: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUserSuccess: (state, action: PayloadAction<boolean>) => {
            state.success = action.payload;
            state.loading = false;
        },
        setUserError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        resetUserStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
});

export const { setUserLoading, setUserSuccess, setUserError, resetUserStatus } = userSlice.actions;
export default userSlice.reducer;
