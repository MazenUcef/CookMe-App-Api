"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const Schema_1 = require("../modals/Schema");
const drizzle_orm_1 = require("drizzle-orm");
const GetFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const favUser = yield index_1.db.select().from(Schema_1.favoritesTable).where((0, drizzle_orm_1.eq)(Schema_1.favoritesTable.userId, userId));
        res.status(200).json({
            message: "Favorites fetched successfully",
            data: favUser
        });
    }
    catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
const AddToFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;
        const newFavorites = yield index_1.db.insert(Schema_1.favoritesTable).values({
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
    }
    catch (error) {
        console.error("Error adding to favorites:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
const DeleteFromFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, recipeId } = req.params;
        const deletedFavorites = yield index_1.db.delete(Schema_1.favoritesTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.favoritesTable.userId, userId), (0, drizzle_orm_1.eq)(Schema_1.favoritesTable.recipeId, parseInt(recipeId))));
        res.status(200).json({
            message: "Recipe removed from favorites successfully",
        });
    }
    catch (error) {
        console.error("Error deleting from favorites:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
exports.default = {
    AddToFavorites,
    DeleteFromFavorites,
    GetFavorites
};
