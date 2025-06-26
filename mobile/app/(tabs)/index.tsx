import { Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MealApi } from '@/services/mealAPI'
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import CategoryFilter from '@/components/CategoryFilter';
import RecipeCard from '@/components/RecipeCard';


const debounce = (ms: number) => new Promise(resolve => setTimeout(() => resolve, ms))


const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function HomeScreen() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [recipes, setRecipes] = useState<ReturnType<typeof MealApi.transformMealData>[]>([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [featuredRecipe, setFeaturedRecipe] = useState<ReturnType<typeof MealApi.transformMealData> | null>(null)



    const loadData = async () => {
        try {
            setLoading(true)
            const [categories, randomMeals, featuredMeal] = await Promise.all([
                MealApi.getCategories(),
                MealApi.getRandomMeals(12),
                MealApi.getRandomMeal()
            ])


            const transformedCategories = categories.map((cat: any, index: any) => ({
                id: index + 1,
                name: cat.strCategory,
                image: cat.strCategoryThumb,
                description: cat.strCategoryDescription
            }))

            setCategories(transformedCategories);

            if (!selectedCategory) setSelectedCategory(transformedCategories[0].name)
            const transformedMeals = randomMeals.map((meal) => MealApi.transformMealData(meal)).filter(meal => meal !== null)
            setRecipes(transformedMeals)

            const transformedFeatured = MealApi.transformMealData(featuredMeal)
            setFeaturedRecipe(transformedFeatured)
        } catch (error) {
            console.log("error loading data", error);
        } finally {
            setLoading(false)
        }
    }



    const loadCategoryData = async (category: any) => {
        try {
            const meals = await MealApi.filterByCategory(category);
            const transformdMeals = meals.map((meal: any) => MealApi.transformMealData(meal)).filter((meal: any) => meal !== null)
            setRecipes(transformdMeals)
        } catch (error) {
            console.error("Error loading category data", error)
            setRecipes([])
        }
    }

    const handleCatgorySelect = async (categroy: any) => {
        setSelectedCategory(categroy)
        await loadCategoryData(categroy)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={styles.welcomeSection}>
                    <Image
                        source={require('@/assets/images/lamb.png')}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />
                    <Image
                        source={require('@/assets/images/chicken.png')}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />
                    <Image
                        source={require('@/assets/images/pork.png')}
                        style={{
                            width: 100,
                            height: 100
                        }}
                    />
                </View>

                {featuredRecipe && (
                    <View style={styles.featuredSection}>
                        <TouchableOpacity
                            style={styles.featuredCard}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
                        >
                            <View style={styles.featuredImageContainer}>
                                <Image
                                    source={{ uri: featuredRecipe.image }}
                                    style={styles.featuredImage}
                                    contentFit='cover'
                                    transition={500}
                                />
                                <View style={styles.featuredOverlay}>
                                    <View style={styles.featuredBadge}>
                                        <Text style={styles.featuredBadgeText}>
                                            Featured
                                        </Text>
                                    </View>
                                    <View style={styles.featuredContent}>
                                        <Text style={styles.featuredTitle} numberOfLines={2}>
                                            {featuredRecipe.title}
                                        </Text>

                                        <View style={styles.featuredMeta}>
                                            <View style={styles.metaItem}>
                                                <Ionicons name='time-outline' size={16} color={COLORS.white} />
                                                <Text style={styles.metaText}>{featuredRecipe.cookTime}</Text>
                                            </View>
                                            <View style={styles.metaItem}>
                                                <Ionicons name='people-outline' size={16} color={COLORS.white} />
                                                <Text style={styles.metaText}>{featuredRecipe.servings}</Text>
                                            </View>
                                            {featuredRecipe.area && (
                                                <View style={styles.metaItem}>
                                                    <Ionicons name='location-outline' size={16} color={COLORS.white} />
                                                    <Text style={styles.metaText}>{featuredRecipe.area}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                )}



                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCatgorySelect}
                    />
                )}


                <View style={styles.recipesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {selectedCategory}
                        </Text>
                    </View>


                    <FlatList
                        data={recipes}
                        renderItem={({ item }) => <RecipeCard recipe={item} />}
                        keyExtractor={(item) => item?.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.recipesGrid}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name='restaurant-outline' size={64} color={COLORS.textLight} />
                                <Text style={styles.emptyTitle}>No recipes found</Text>
                                <Text style={styles.emptyDescription}>Try a different category</Text>
                            </View>
                        }
                    />

                </View>
            </ScrollView>
            {/* <TouchableOpacity onPress={signout}>
                <Text>Signout</Text>
            </TouchableOpacity> */}
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    featuredSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    featuredCard: {
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: COLORS.card,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    featuredImageContainer: {
        height: 240,
        backgroundColor: COLORS.primary,
        position: "relative",
    },
    featuredImage: {
        width: "100%",
        height: "100%",
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "space-between",
        padding: 20,
    },
    featuredBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    featuredBadgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
    },
    featuredContent: {
        justifyContent: "flex-end",
    },
    featuredTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.white,
        marginBottom: 12,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    featuredMeta: {
        flexDirection: "row",
        gap: 16,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: "600",
    },
    recipesSection: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    recipesGrid: {
        gap: 16,
    },
    row: {
        justifyContent: "space-between",
        gap: 16,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 64,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: "center",
    },
    categoryFilterContainer: {
        marginVertical: 16,
    },
    categoryFilterScrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    categoryButton: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.card,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        minWidth: 80,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedCategory: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowOpacity: 0.15,
    },
    categoryImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 4,
        backgroundColor: COLORS.border,
    },
    selectedCategoryImage: {
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.text,
        textAlign: "center",
    },
    selectedCategoryText: {
        color: COLORS.white,
    },
});
