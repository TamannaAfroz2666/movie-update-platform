import { body, validationResult } from 'express-validator';

export const validateRegistration = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),
];

export function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(arr => ({
                field: arr.path,
                message: arr.msg
            }))
        })
    }
    next()

}