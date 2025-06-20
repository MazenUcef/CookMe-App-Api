"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FavoritesControllers_1 = __importDefault(require("../controllers/FavoritesControllers"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/:userId', FavoritesControllers_1.default.GetFavorites);
router.post('/', validation_1.validateAddToFav, FavoritesControllers_1.default.AddToFavorites);
router.delete('/:userId/:recipeId', FavoritesControllers_1.default.DeleteFromFavorites);
exports.default = router;
