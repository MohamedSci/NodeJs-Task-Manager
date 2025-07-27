// src/auth/authMiddleware.js
// Middleware for authenticating requests using JSON Web Tokens (JWT).

const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const userModel = require('../models/userModel'); // Used to find user by ID from token

// Protects routes by verifying the JWT in the Authorization header.
const protect = (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract the token
    }

    // If no token is provided, return an authentication error
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token's ID
        const currentUser = userModel.findById(decoded.id);

        // If user not found, return an error
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // Attach the user object to the request for subsequent middleware/route handlers
        req.user = currentUser;
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        // Handle various JWT errors (e.g., invalid token, expired token)
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired! Please log in again.', 401));
        }
        // Catch any other unexpected errors during token verification
        next(new AppError('Authentication failed.', 500));
    }
};

module.exports = protect;
