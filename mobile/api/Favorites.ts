import { addFavorite, removeFavorite, setFavorites, setFavoritesError, setFavoritesLoading } from "@/redux/favoritesSlice.ts";
import { AppDispatch, RootState } from "@/store"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"

export const useGetFavorites = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { favorites, isLoading, error } = useSelector((state: RootState) => state.favorites);

    const getFavorites = async (userId: string) => {
        dispatch(setFavoritesLoading(true))
        try {
            const res = await axios.get(`https://cookme-app-api.onrender.com/api/favorites/${userId}`)

            dispatch(setFavorites(res.data.data))
            dispatch(setFavoritesLoading(false))
            return res.data.data;
        } catch (error: any) {
            dispatch(setFavoritesError(error.response?.data?.message || 'Failed to fetch favorites'));
            dispatch(setFavoritesLoading(false));
            throw error;
        }
    }

    return {
        favorites,
        isLoading,
        error,
        getFavorites,
    };
};


export const useAddToFavorites = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.favorites);

    const addToFavorites = async (
        userId: string,
        recipeId: number,
        title: string,
        image: string,
        cookTime: number,
        servings: number
    ) => {
        dispatch(setFavoritesLoading(true))
        try {
            const res = await axios.post(
                `https://cookme-app-api.onrender.com/api/favorites`, {
                userId,
                recipeId,
                title,
                image,
                cookTime,
                servings
            },
            );

            dispatch(addFavorite(res.data.data));
            dispatch(setFavoritesLoading(false));
            return res.data.data;
        } catch (error: any) {
            dispatch(setFavoritesError(error.response?.data?.message || 'Failed to add to favorites'));
            dispatch(setFavoritesLoading(false));
            throw error;
        }
    };

    return {
        isLoading,
        error,
        addToFavorites,
    };
}


export const useRemoveFromFavorites = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.favorites);

    const removeFromFavorites = async (userId: string, recipeId: number) => {
        dispatch(setFavoritesLoading(true));
        try {
            const res = await axios.delete(`https://cookme-app-api.onrender.com/api/favorites/${userId}/${recipeId}`);

            // Only update Redux state if API call was successful
            if (res.status === 200) {
                dispatch(removeFavorite({
                    userId,
                    recipeId
                }));
            }

            return true;
        } catch (error: any) {
            dispatch(setFavoritesError(error.response?.data?.message || 'Failed to remove from favorites'));
            throw error;
        } finally {
            dispatch(setFavoritesLoading(false));
        }
    };

    return {
        isLoading,
        error,
        removeFromFavorites,
    };
}