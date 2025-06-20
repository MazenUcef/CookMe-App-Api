import { RequestHandler } from "express";
import { body, validationResult } from "express-validator";


const handleValidationsErrors: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return;
    }
    next();
}


export const validateAddToFav: RequestHandler[] = [
    body('userId')
        .notEmpty().withMessage('User Id is required'),

    body('recipeId')
        .notEmpty().withMessage('Recipe Id is required'),

    body('title')
        .notEmpty().withMessage('Title is required'),
    handleValidationsErrors
];