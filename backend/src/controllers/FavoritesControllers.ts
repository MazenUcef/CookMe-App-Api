import { Request, Response } from "express";
import { db } from "../index";
import { favoritesTable } from "../modals/Schema";
import { and, eq } from "drizzle-orm";



const GetFavorites = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const favUser = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId))
        res.status(200).json({
            message: "Favorites fetched successfully",
            data: favUser
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}


const AddToFavorites = async (req: Request, res: Response) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body
        const newFavorites = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();
        res.status(201).json({
            message: "Recipe added to favorites successfully",
            data: newFavorites[0]
        });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

const DeleteFromFavorites = async (req: Request, res: Response) => {
    try {
        const { userId, recipeId } = req.params;
        const deleted = await db.delete(favoritesTable)
            .where(
                and(
                    eq(favoritesTable.userId, userId),
                    eq(favoritesTable.recipeId, parseInt(recipeId))
                )
            )
            .returning(); // Add this to get the deleted record

        if (deleted.length === 0) {
            return res.status(404).json({
                message: "Favorite not found",
            });
        }

        res.status(200).json({
            message: "Recipe removed from favorites successfully",
            data: deleted[0] // Return the deleted record
        });
    } catch (error) {
        console.error("Error deleting from favorites:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export default {
    AddToFavorites,
    DeleteFromFavorites,
    GetFavorites
}