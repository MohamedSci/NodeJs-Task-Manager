// src/controllers/authController.js
// Handles user authentication logic: registration and login.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel'); // Our mock user database
const AppError = require('../utils/AppError');

// Helper function to generate a JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// POST /api/auth/register
// Registers a new user.
exports.register = async (req, res, next) => {
    // Validate request body using express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Validation failed', 400, errors.array()));
    }

    const { username, password } = req.body;

    // Check if user already exists
    if (userModel.findByUsername(username)) {
        return next(new AppError('User with this username already exists', 409)); // 409 Conflict
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 12); // Salt rounds: 12

        // Create the new user
        const newUser = userModel.create({
            username,
            password: hashedPassword, // Store hashed password
        });

        // Generate a token for the new user
        const token = signToken(newUser.id);

        // Respond with success and the token
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: { id: newUser.id, username: newUser.username }, // Don't send hashed password
            },
        });
    } catch (err) {
        // Pass any unexpected errors to the global error handler
        next(new AppError('Could not register user', 500));
    }
};

// POST /api/auth/login
// Logs in an existing user.
exports.login = async (req, res, next) => {
    // Validate request body using express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Validation failed', 400, errors.array()));
    }

    const { username, password } = req.body;

    // 1. Check if user exists and password is provided
    if (!username || !password) {
        return next(new AppError('Please provide username and password!', 400));
    }

    // 2. Get user from the "database"
    const user = userModel.findByUsername(username);

    // 3. Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect username or password', 401));
    }

    // 4. If everything is ok, send token to client
    const token = signToken(user.id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: { id: user.id, username: user.username },
        },
    });
};
