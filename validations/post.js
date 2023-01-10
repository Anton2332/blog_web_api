import { body } from "express-validator";

export const createValidation = [
    body('title', 'Enter the title of the article').isLength({min: 3}).isString(),
    body('text', 'Enter the text of the article').isLength({ min: 3}).isString(),
    body('tags', 'Invalid tag format').optional().isString(),
    body('imageUrl', 'Invalid image link').optional().isString(),
]