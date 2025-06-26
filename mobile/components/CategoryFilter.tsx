import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors';
import { Image } from 'expo-image';

type Category = {
    id: number;
    name: string;
    image: string;
    description: string;
};

type CategoryFilterProps = {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (category: string) => void;
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <View style={styles.categoryFilterContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryFilterScrollContent}
            >
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.categoryButton, isSelected && styles.selectedCategory]}
                            onPress={() => onSelectCategory(category.name)}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={{ uri: category.image }}
                                style={[styles.categoryImage, isSelected && styles.selectedCategoryImage]}
                                contentFit='cover'
                                transition={300}
                            />
                            <Text
                                style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
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