import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Not valid email').isEmail(),
    body('password', 'Password must be more than 5 characters').isLength({ min: 6 }),
]

export const registerValidation = [
    body('email', 'Not valid email').isEmail(),
    body('password', 'Password must be more than 5 characters').isLength({ min: 6 }),
    body('fullName', 'Not valid Name').isLength({ min: 3 }),
    body('avatarUrl', 'Not valid URL on Avatar').optional().isURL(),
]