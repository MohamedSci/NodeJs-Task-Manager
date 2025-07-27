// src/utils/validation.js
// A reusable middleware function to check for validation results
// from `express-validator`. If validation errors are present,
// it constructs an `AppError` and passes it to the next error handling middleware.

const { validationResult } = require('express-validator');
const AppError = require('./AppError'); // Import our custom AppError class

/**
 * Middleware to process validation results from express-validator.
 * If validation errors are found, it creates an AppError (status 400 - Bad Request)
 * with details of the validation failures and passes it to the next error handling middleware.
 * Otherwise, it proceeds to the next middleware or route handler.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const validate = (req, res, next) => {
    // Get the validation results from the request object, populated by express-validator
    const errors = validationResult(req);

    // If there are no validation errors, proceed to the next middleware or route handler
    if (errors.isEmpty()) {
        return next();
    }

    // If validation errors exist, extract them and format them for the error response.
    // The `errors.array()` method returns an array of error objects, each typically
    // containing properties like `msg` (the error message), `param` (the field name), etc.
    // We map them to a more client-friendly format: an array of objects
    // where each object has a key-value pair of the parameter and its corresponding error message.
    const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));

    // Create a new AppError instance with a 400 (Bad Request) status code.
    // This error signifies that the client's request was malformed due to invalid input.
    // We include a general message and the specific `extractedErrors` array for detailed feedback.
    return next(new AppError('Validation failed', 400, extractedErrors));
};

module.exports = validate;
