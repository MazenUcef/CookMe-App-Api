import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSignOut } from '@/api/Auth'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FavoriteRecipe } from '@/redux/favoritesSlice.ts'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import RecipeCard from '@/components/RecipeCard'
import NoFavoritesFound from '@/components/NoFavoritesFound'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useGetFavorites } from '@/api/Favorites'


export default function favorites() {
    const { signout } = useSignOut()
    const { user } = useSelector((state: RootState) => state.auth)
    const { favorites: FavRedux, isLoading } = useSelector((state: RootState) => state.favorites)
    const { getFavorites, favorites } = useGetFavorites()
    const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);

    useEffect(() => {
        if (user?.id) {
            getFavorites(user.id);
        }
    }, [user?.id])
    console.log("favorrites", favorites);


    useEffect(() => {
        const loadFavorites = async () => {
            try {
                // Ensure recipeId is treated as number consistently
                const transformedFavorites = favorites.map(favorite => ({
                    ...favorite,
                    id: favorite.recipeId.toString(), // For RecipeCard compatibility
                    recipeId: favorite.recipeId, // Original number ID
                    userId: favorite.userId,
                    title: favorite.title,
                    image: favorite.image,
                    cookTime: favorite.cookTime,
                    servings: favorite.servings,
                    area: favorite.area,
                    description: favorite.description,
                }));
                setFavoriteRecipes(transformedFavorites);
            } catch (error) {
                Alert.alert("Error", "Failed to load Favorites");
            }
        };

        if (user?.id) loadFavorites();
    }, [favorites, user?.id]);

    const handleSignOut = async () => {
        Alert.alert("Logout", "Are you sure you want to logout", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: signout },
        ])
    }

    if (isLoading) return <LoadingSpinner message='Loading your favorites' />
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Favorites</Text>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleSignOut}
                    >
                        <Ionicons size={22} color={COLORS.text} name='log-out-outline' />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={signout}
                >
                    <Text>signout</Text>
                </TouchableOpacity>

                <View style={styles.recipesSection}>
                    <FlatList
                        data={favoriteRecipes}
                        renderItem={({ item }) => (
                            <RecipeCard
                                recipe={{
                                    id: item.recipeId.toString(),
                                    title: item.title,
                                    image: item.image,
                                    cookTime: item.cookTime,
                                    servings: item.servings,
                                    area: item.area,
                                    description: item.description
                                }}
                            />
                        )}
                        keyExtractor={(item) => item.recipeId.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.recipesGrid}
                        scrollEnabled={false}
                        ListEmptyComponent={<NoFavoritesFound />}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    logoutButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statsContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginTop: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text,
    },
    recipesSection: {
        paddingHorizontal: 16,
        marginTop: 24,
        paddingBottom: 32,
    },
    recipesGrid: {
        gap: 16,
    },
    row: {
        justifyContent: "space-between",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 64,
        paddingHorizontal: 32,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.card,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: "dashed",
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 24,
    },
    exploreButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
    },
    exploreButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.white,
    },
});