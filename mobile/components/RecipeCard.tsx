import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

type Recipe = {
    id: string;
    title: string;
    image: string;
    cookTime?: string;
    servings?: string;
    area?: string;
    description?: string;
};

type RecipeCardProps = {
    recipe: Recipe | null;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: recipe?.image }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {recipe?.title}
                </Text>
                {recipe?.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {recipe.description}
                    </Text>
                )}

                <View style={styles.footer}>
                    {recipe?.cookTime && (
                        <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                            <Text style={styles.timeText}>{recipe.cookTime}</Text>
                        </View>
                    )}
                    {recipe?.servings && (
                        <View style={styles.servingsContainer}>
                            <Ionicons name="people-outline" size={14} color={COLORS.textLight} />
                            <Text style={styles.servingsText}>{recipe.servings}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        height: 140,
    },
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.border,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: 4,
        lineHeight: 20,
    },
    description: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 8,
        lineHeight: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        fontSize: 11,
        color: COLORS.textLight,
        marginLeft: 4,
        fontWeight: "500",
    },
    servingsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    servingsText: {
        fontSize: 11,
        color: COLORS.textLight,
        marginLeft: 4,
        fontWeight: "500",
    },
});