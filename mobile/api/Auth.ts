import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { clearAuth, setAuth, setError, setLoading } from "@/redux/authSlice";
import { useRouter } from "expo-router";
import { useEffect } from "react";




export const useSignUp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { accessToken, refreshToken, isLoading, error, user } = useSelector((state: RootState) => state.auth)

    const signup = async (email: string, password: string) => {
        dispatch(setLoading(true))
        try {
            const res = await axios.post(`https://cookme-app-api.onrender.com/api/auth/signup`, {
                email,
                password
            });
            dispatch(setLoading(false))
            console.log("sign up response", res);

            return res.data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Sign up failed'));
            dispatch(setLoading(false));
            throw error;
        }
    };


    return {
        accessToken,
        refreshToken,
        isLoading,
        error,
        user,
        signup,
    };
}



export const useSignIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { accessToken, refreshToken, isLoading, error, user } = useSelector((state: RootState) => state.auth);

    const signin = async (email: string, password: string) => {
        dispatch(setLoading(true));
        try {
            const res = await axios.post(`https://cookme-app-api.onrender.com/api/auth/signin`, {
                email,
                password
            });

            dispatch(setAuth({
                user: res.data.user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken
            }));

            dispatch(setLoading(false));
            console.log("sign in response", res.data);
            return res.data;
        } catch (error: any) {
            dispatch(setError(error.response?.data?.message || 'Sign in failed'));
            dispatch(setLoading(false));
            throw error;
        }
    };

    return {
        accessToken,
        refreshToken,
        isLoading,
        error,
        user,
        signin,
    };
};




export const useRefreshToken = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { refreshToken } = useSelector((state: RootState) => state.auth);

    const refresh = async () => {
        dispatch(setLoading(true));
        try {
            const res = await axios.post(`https://cookme-app-api.onrender.com/api/auth/refresh-token`,
                {
                    refreshToken
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            dispatch(setAuth({
                user: res.data.user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken
            }));

            dispatch(setLoading(false));
            console.log("refresh token res", res);
            return res.data;
        } catch (error: any) {
            dispatch(clearAuth());
            dispatch(setError(error.response?.data?.message || 'Session expired'));
            dispatch(setLoading(false));
            throw error;
        }
    }
    return {
        refresh
    };
}



export const useSignOut = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter(); // Add this line
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

    const signout = async () => {
        dispatch(setLoading(true));
        try {
            const res = await axios.post(`https://cookme-app-api.onrender.com/api/auth/signout`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken || refreshToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            dispatch(clearAuth());
            dispatch(setLoading(false));
            console.log("signout res", res);

            // Add this redirect after signout
            router.replace('/(auth)/signIn');

            return res.data;
        } catch (error: any) {
            dispatch(clearAuth());
            dispatch(setError(error.response?.data?.message || 'Logout failed'));
            dispatch(setLoading(false));
            throw error;
        }
    };

    return {
        signout
    };
};



export function useAuthRedirect() {
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (accessToken && refreshToken) {
            router.replace('/');
        }
    }, [accessToken, refreshToken]);
}