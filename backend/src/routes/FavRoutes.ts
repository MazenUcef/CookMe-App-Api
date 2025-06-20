import express from 'express';
import FavoritesControllers from '../controllers/FavoritesControllers';
import { validateAddToFav } from '../middleware/validation';

const router = express.Router();


router.get('/:userId', FavoritesControllers.GetFavorites)
router.post('/', validateAddToFav, FavoritesControllers.AddToFavorites)
router.delete('/:userId/:recipeId', FavoritesControllers.DeleteFromFavorites)

export default router;