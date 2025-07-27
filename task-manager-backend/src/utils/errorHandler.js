// src/utils/errorHandler.js
// Global error handling middleware for Express.
// This module centralizes how errors are processed and sent as responses.
// It differentiates between development and production environments to
// provide more detailed errors during development and simplified,
// non-sensitive errors in production. It also handles specific error types
// like JWT errors.

const AppError = require('./AppError');

/**
 * Handles JsonWebTokenError (e.g., malformed token).
 * @returns {AppError} A new AppError instance for invalid token.
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

/**
 * Handles TokenExpiredError (e.g., expired JWT).
 * @returns {AppError} A new AppError instance for expired token.
 */
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

/**
 * Sends detailed error response during development.
 * Includes status, error object, message, stack trace, and validation errors.
 * @param {AppError} err - The error object.
 * @param {Object} res - The Express response object.
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        validationErrors: err.validationErrors, // Include validation errors for client debugging
    });
};

/**
 * Sends simplified error response in production.
 * Only sends operational errors with their message. For programming errors,
 * it sends a generic message to prevent leaking sensitive details.
 * @param {AppError} err - The error object.
 * @param {Object} res - The Express response object.
 */
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    // These are errors we've explicitly defined and expect to handle.
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error: don't leak error details to the client.
        // Log the error for internal debugging.
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!', // Generic message for unexpected errors
        });
    }
};

/**
 * The main global error handling middleware.
 * @param {Error} err - The error object passed from previous middleware or route handlers.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
module.exports = (err, req, res, next) => {
    // Set default status code and status if not already defined by an AppError
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Determine the environment (development or production)
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Create a mutable copy of the error object
        let error = { ...err };
        // Ensure the message property is copied, as it's not enumerable
        error.message = err.message;

        // Handle specific error types that might come from external libraries (e.g., jsonwebtoken)
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
