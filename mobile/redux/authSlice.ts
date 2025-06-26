import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: null | {
        id: string,
        email: string
    };
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setAuth: (state, action: PayloadAction<{
            user: { id: string; email: string }; accessToken: string; refreshToken: string
        }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.error = null
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
        },
    }
})
export const { setLoading, setError, setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;