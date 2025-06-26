import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '@/constants/colors';
import { MealApi } from '@/services/mealAPI';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '@/components/RecipeCard';
import NoResultsFound from '@/components/NoResultsFound';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function search() {
    const [recipes, setRecipes] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)


    const performedSearch = async (query: string) => {
        if (!query.trim()) {
            const randomMeals = await MealApi.getRandomMeals(12)
            return randomMeals.map(meal => MealApi.transformMealData(meal))
                .filter(meal => meal !== null)
        }

        const nameResults = await MealApi.searchMealsByName(query)
        let results = nameResults

        if (results.length === 0) {
            const ingredientResults = await MealApi.filterByIngredient(query)
            results = ingredientResults
        }

        return results.slice(0, 12).map((meal: any) => MealApi.transformMealData(meal))
            .filter((meal: any) => meal !== null)
    }

    // Initial load
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true)
            try {
                const res = await performedSearch("")
                setRecipes(res)
            } catch (error) {
                console.log("error:", error)
            } finally {
                setLoading(false)
            }
        }

        loadInitialData()
    }, [])

    // Search when query changes (with debounce)
    useEffect(() => {
        const handler = setTimeout(() => {
            const search = async () => {
                setLoading(true)
                try {
                    const res = await performedSearch(searchQuery)
                    setRecipes(res)
                } catch (error) {
                    console.log("error:", error)
                } finally {
                    setLoading(false)
                }
            }
            search()
        }, 500)

        return () => clearTimeout(handler)
    }, [searchQuery])
    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons
                        name='search'
                        color={COLORS.textLight}
                        style={styles.searchIcon}
                        size={20}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search recipes, ingredients...'
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType='search'
                    />

                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setSearchQuery("")}
                        >
                            <Ionicons
                                name='close-circle'
                                size={20}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.resultsSection}>
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>
                        {searchQuery ? `Results for "${searchQuery}"` : "Popular Recipes"}
                    </Text>
                    <Text style={styles.resultsCount}>{recipes.length} found</Text>
                </View>
            </View>

            {loading ?
                (
                    <View style={styles.loadingContainer}>
                        <LoadingSpinner />
                    </View>
                )
                :
                (
                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item: any) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.recipesGrid}
                        ListEmptyComponent={<NoResultsFound />}
                    />
                )
            }
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    clearButton: {
        padding: 4,
    },
    quickFilters: {
        marginTop: 20,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 12,
    },
    filterButtons: {
        flexDirection: "row",
        gap: 12,
    },
    quickFilterButton: {
        backgroundColor: COLORS.card,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeQuickFilter: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    quickFilterText: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.text,
    },
    activeQuickFilterText: {
        color: COLORS.white,
    },
    resultsSection: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    resultsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 16,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text,
        flex: 1,
    },
    resultsCount: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    recipesGrid: {
        gap: 16,
        paddingBottom: 32,
        paddingLeft: 6,
        paddingRight: 6
    },
    row: {
        justifyContent: "space-between",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 64,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: "center",
        lineHeight: 20,
    },
});