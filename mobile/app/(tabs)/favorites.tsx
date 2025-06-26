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


export default function favorites() {
    const { signout } = useSignOut()
    const { user } = useSelector((state: RootState) => state.auth)
    const { favorites, isLoading } = useSelector((state: RootState) => state.favorites)

    const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);


    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const transformedFavorites = favorites.map(favorite => ({
                    ...favorite,
                    id: favorite.recipeId
                }))
                setFavoriteRecipes(transformedFavorites)
            } catch (error) {
                Alert.alert("Error", "Failed to load Favorites")
            }
        }
        loadFavorites()
    }, [user?.id])

    const handleSignOut = async () => {
        await signout()
    }

    if (isLoading) return <LoadingSpinner />
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

                <View style={styles.recipesSection}>
                    <FlatList
                        data={favoriteRecipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item.userId.toString()}
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