import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useAddToFavorites, useGetFavorites, useRemoveFromFavorites } from '@/api/Favorites'
import { MealApi } from '@/services/mealAPI'
import LoadingSpinner from '@/components/LoadingSpinner'
import { COLORS } from '@/constants/colors'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'

type Recipe = {
    youtubeUrl: string | null
    id?: any
    title?: any
    description?: string
    image?: any
    cookTime?: string
    servings?: number
    category?: any
    area?: any
    ingredients?: string[]
    instructions?: any
    originalData?: any
} | null

export default function RecipeDetailScreen() {
    const { id: recipeId } = useLocalSearchParams()
    const [recipe, setRecipe] = useState<Recipe>(null)
    const [loading, setLoading] = useState(true)
    const [isSaved, setIsSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { user } = useSelector((state: RootState) => state.auth)
    const { favorites } = useSelector((state: RootState) => state.favorites)
    const { removeFromFavorites } = useRemoveFromFavorites()
    const { addToFavorites } = useAddToFavorites()
    const { getFavorites } = useGetFavorites()

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const isRecipeSaved = favorites.some((fav) => fav.recipeId === Number(recipeId))
                setIsSaved(isRecipeSaved)
            } catch (error) {
                console.error("Error checking if recipe is saved:", error)
            }
        };

        const loadRecipeDetail = async () => {
            setLoading(true)
            try {
                const id = Array.isArray(recipeId) ? recipeId[0] : recipeId
                const mealData = await MealApi.getMealById(id)
                if (mealData) {
                    const transformedRecipe = MealApi.transformMealData(mealData);

                    const recipeWithVideo = {
                        ...transformedRecipe,
                        youtubeUrl: mealData.strYoutube || null
                    }
                    setRecipe(recipeWithVideo)
                }
            } catch (error) {
                console.error("Error loading recipe detail:", error);

            } finally {
                setLoading(false)
            }
        }

        checkIfSaved()
        loadRecipeDetail()
    }, [recipeId, user?.id])


    const getYoutubeEmbeUrl = (url: string) => {
        // Handle both full URLs and shortened youtu.be URLs
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;

        if (!videoId) return url; // fallback to original URL if extraction fails

        return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&showinfo=0&controls=1`;
    }

    // Update the handleToggleSave function
    const handleToggleSave = async () => {
        if (!user?.id) {
            Alert.alert("Login Required", "Please login to save favorites");
            return;
        }

        setIsSaving(true);
        try {
            const idToUse = Array.isArray(recipeId) ? recipeId[0] : recipeId;
            if (!idToUse) throw new Error("Invalid recipe ID");

            const numericRecipeId = Number(idToUse);

            if (isSaved) {
                await removeFromFavorites(user.id, numericRecipeId);
                await getFavorites(user.id)
                setIsSaved(false);
                Alert.alert("Success", "Removed from favorites");
            } else {
                if (!recipe) throw new Error("Recipe data not loaded");

                await addToFavorites(
                    user.id,
                    numericRecipeId,
                    recipe.title || "Untitled Recipe",
                    recipe.image || "",
                    recipe.cookTime ? (parseInt(recipe.cookTime.replace(/\D/g, '')) || 0) : 0,
                    recipe.servings || 1
                );
                await getFavorites(user.id)
                setIsSaved(true);
                Alert.alert("Success", "Added to favorites");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            Alert.alert("Error", "Failed to update favorites");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) return <LoadingSpinner message='Loading recipe details...' />;
    console.log(recipe?.youtubeUrl);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: recipe?.image }}
                            style={styles.headerImage}
                            contentFit='cover'
                        />
                    </View>
                    <LinearGradient
                        style={styles.gradientOverlay}
                        colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
                    />
                    <View style={styles.floatingButtons}>
                        <TouchableOpacity
                            style={styles.floatingButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                size={24}
                                color={COLORS.white}
                                name='arrow-back'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.floatingButton,
                                { backgroundColor: isSaving ? COLORS.primary : COLORS.primary },
                            ]}
                            onPress={handleToggleSave}
                            disabled={isSaving}
                        >
                            <Ionicons
                                name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"}
                                size={24}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleSection}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{recipe?.category}</Text>
                        </View>
                        <Text style={styles.recipeTitle}>{recipe?.title}</Text>
                        {
                            recipe?.area && (
                                <View style={styles.locationRow}>
                                    <Ionicons
                                        name='location'
                                        size={16}
                                        color={COLORS.white}
                                    />
                                    <Text style={styles.locationText}>Cuisine</Text>
                                </View>
                            )
                        }
                    </View>

                </View>
                <View style={styles.contentSection}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <LinearGradient
                                colors={["#FF6868", "#FF8E53"]}
                                style={styles.statIconContainer}
                            >
                                <Ionicons
                                    name='time'
                                    size={20}
                                    color={COLORS.white}
                                />
                            </LinearGradient>
                            <Text style={styles.statValue}>{recipe?.cookTime}</Text>
                            <Text style={styles.statLabel}>Prep Time</Text>
                        </View>
                        <View style={styles.statCard}>
                            <LinearGradient
                                colors={["#4ECDC4", "#44A08D"]}
                                style={styles.statIconContainer}
                            >
                                <Ionicons
                                    name='people'
                                    size={20}
                                    color={COLORS.white}
                                />
                            </LinearGradient>
                            <Text style={styles.statValue}>{recipe?.servings}</Text>
                            <Text style={styles.statLabel}>Servings</Text>
                        </View>
                    </View>

                    {recipe?.youtubeUrl && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionTitleRow}>
                                <LinearGradient
                                    colors={["#FF0000", "#CC0000"]}
                                    style={styles.sectionIcon}
                                >
                                    <Ionicons
                                        name='play'
                                        size={16}
                                        color={COLORS.white}
                                    />
                                </LinearGradient>

                                <Text style={styles.sectionTitle}>
                                    Video Tutorial
                                </Text>
                            </View>
                            <View style={styles.webviewContainer}>
                                <WebView
                                    style={styles.webview}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    source={{ uri: getYoutubeEmbeUrl(recipe.youtubeUrl) }}
                                    allowsFullscreenVideo={true}
                                    allowsInlineMediaPlayback={true}
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionTitleRow}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primary + "80"]}
                                style={styles.sectionIcon}
                            >
                                <Ionicons
                                    name='list'
                                    size={16}
                                    color={COLORS.white}
                                />
                            </LinearGradient>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{recipe?.ingredients?.length}</Text>
                            </View>
                        </View>
                        <View style={styles.ingredientsGrid}>
                            {recipe?.ingredients?.map((ingredient, index) => (
                                <View key={index} style={styles.ingredientCard}>
                                    <View style={styles.ingredientNumber}>
                                        <Text style={styles.ingredientText}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <Text style={styles.ingredientText}>{ingredient}</Text>
                                    <View style={styles.ingredientCheck}>
                                        <Ionicons
                                            name='checkmark-circle-outline'
                                            size={20}
                                            color={COLORS.textLight}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionTitleRow}>
                            <LinearGradient
                                colors={["#9C27B0", "#673AB7"]}
                                style={styles.sectionIcon}
                            >
                                <Ionicons name="book" size={16} color={COLORS.white} />
                            </LinearGradient>
                            <Text style={styles.sectionTitle}>Instructions</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{recipe?.instructions.length}</Text>
                            </View>
                        </View>
                        <View style={styles.instructionsContainer}>
                            {recipe?.instructions.map((instruction: any, index: any) => (
                                <View key={index} style={styles.instructionCard}>
                                    <LinearGradient
                                        colors={[COLORS.primary, COLORS.primary + "CC"]}
                                        style={styles.stepIndicator}
                                    >
                                        <Text style={styles.stepNumber}>{index + 1}</Text>
                                    </LinearGradient>
                                    <View style={styles.instructionContent}>
                                        <Text style={styles.instructionText}>{instruction}</Text>
                                        <View style={styles.instructionFooter}>
                                            <Text style={styles.stepLabel}>Step {index + 1}</Text>
                                            <TouchableOpacity style={styles.completeButton}>
                                                <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleToggleSave}
                        disabled={isSaving}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primary + "CC"]}
                            style={styles.buttonGradient}
                        >
                            <Ionicons name="heart" size={20} color={COLORS.white} />
                            <Text style={styles.buttonText}>
                                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )
}

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerContainer: {
        height: height * 0.5,
        position: "relative",
    },
    imageContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    headerImage: {
        width: "100%",
        height: "120%",
    },
    gradientOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60%",
    },
    floatingButtons: {
        position: "absolute",
        top: 50,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    floatingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(10px)",
    },
    titleSection: {
        position: "absolute",
        bottom: 30,
        left: 16,
        right: 16,
    },
    categoryBadge: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    categoryText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    recipeTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 8,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    locationText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "500",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    contentSection: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    statsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: "center",
        fontWeight: "500",
    },
    sectionContainer: {
        marginBottom: 32,
    },
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
        marginBottom: 16,
    },
    sectionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.text,
        flex: 1,
    },
    countBadge: {
        backgroundColor: COLORS.primary + "20",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "600",
    },
    videoCard: {
        height: 220,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: COLORS.card,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    webviewContainer: {
        height: 220, // Fixed height or calculate based on aspect ratio
        marginTop: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
    },
    ingredientsGrid: {
        gap: 12,
    },
    ingredientCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        gap: 12,
    },
    ingredientNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary + "20",
        justifyContent: "center",
        alignItems: "center",
    },
    ingredientNumberText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "bold",
    },
    ingredientText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 22,
    },
    ingredientCheck: {
        opacity: 0.5,
    },
    instructionsContainer: {
        gap: 16,
    },
    instructionCard: {
        flexDirection: "row",
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        gap: 16,
    },
    stepIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    stepNumber: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    instructionContent: {
        flex: 1,
    },
    instructionText: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        marginBottom: 12,
    },
    instructionFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    stepLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    completeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary + "20",
        justifyContent: "center",
        alignItems: "center",
    },

    primaryButton: {
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.card,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        gap: 10,
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContent: {
        alignItems: "center",
        padding: 32,
    },
    errorTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.white,
        marginTop: 20,
        marginBottom: 12,
    },
    errorDescription: {
        fontSize: 16,
        color: COLORS.white,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
        opacity: 0.9,
    },
    errorButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
    },
    errorButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "bold",
    },
});