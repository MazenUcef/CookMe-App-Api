"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddToFav = void 0;
const express_validator_1 = require("express-validator");
const handleValidationsErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateAddToFav = [
    (0, express_validator_1.body)('userId')
        .notEmpty().withMessage('User Id is required'),
    (0, express_validator_1.body)('recipeId')
        .notEmpty().withMessage('Recipe Id is required'),
    (0, express_validator_1.body)('title')
        .notEmpty().withMessage('Title is required'),
    handleValidationsErrors
];
