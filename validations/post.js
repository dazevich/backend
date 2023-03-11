import { body, query } from "express-validator";

export const postValidation = [
    body('title', 'incorrect title length').isLength({min: 3, max: 30}),
    body('text', 'text length is smaller that 1').isLength({min: 1}),
    body('text', 'text length is bigger that 500').isLength({max: 500}),
    body('tags').optional().isArray(),
    body('imageUrl').optional().isString(),
];

export const fetchPostsValidation = [
    query('user').optional().isMongoId(),
    query('from').optional().isISO8601().toDate(),
    query('to').optional().isISO8601().toDate(),
];