// src/routes/authRoutes.js
// Defines API routes for authentication (registration and login).

const express = require('express');
const { body } = require('express-validator'); // For input validation
const authController = require('../controllers/authController');
const validate = require('../utils/validation'); // Custom validation middleware

const router = express.Router();

// POST /api/auth/register
// Route for user registration.
// Applies validation rules for username and password.
router.post(
    '/register',
    [
        body('username')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long')
            .trim()
            .escape(), // Sanitize input
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    validate, // Custom middleware to check validation results
    authController.register
);

// POST /api/auth/login
// Route for user login.
// Applies validation rules for username and password.
router.post(
    '/login',
    [
        body('username').notEmpty().withMessage('Username is required').trim().escape(),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate, // Custom middleware to check validation results
    authController.login
);

module.exports = router;
