import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export interface FavoriteRecipe {
    userId: string;
    recipeId: string;
    title: string;
    image: string;
    cookTime: string;
    servings: number
}

interface FavoritesState {
    favorites: FavoriteRecipe[];
    isLoading: boolean;
    error: string | null;
}



const initialState: FavoritesState = {
    favorites: [],
    isLoading: false,
    error: null
}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavoritesLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setFavoritesError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setFavorites: (state, action: PayloadAction<FavoriteRecipe[]>) => {
            state.favorites = action.payload;
            state.error = null;
        },
        addFavorite: (state, action: PayloadAction<FavoriteRecipe>) => {
            state.favorites.push(action.payload);
            state.error = null;
        },
        removeFavorite: (state, action: PayloadAction<{ userId: string; recipeId: string }>) => {
            state.favorites = state.favorites.filter(
                fav => !(fav.userId === action.payload.userId && fav.recipeId === action.payload.recipeId)
            );
            state.error = null;
        },
        clearFavorites: (state) => {
            state.favorites = [];
            state.error = null;
        },
    }
});


export const {
    setFavoritesLoading,
    setFavoritesError,
    setFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer;