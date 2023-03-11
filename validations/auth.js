import { body } from "express-validator";

export const registerValidator = [
    body('name').isLength({min: 3, max: 30}),
    body('login').isLength({min: 3, max: 30}),
    body('password').isLength({min: 5}),
    body('avatarUrl').optional().isURL(),
];