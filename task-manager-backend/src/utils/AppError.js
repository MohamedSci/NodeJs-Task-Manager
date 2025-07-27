// src/utils/AppError.js
// Custom error class to standardize application-specific errors.
// This allows us to attach a status code and an operational flag to errors,
// making it easier to differentiate between expected (operational) errors
// and unexpected (programming) errors. It also includes a field for
// validation errors from express-validator.

class AppError extends Error {
  /**
   * Creates a new AppError instance.
   * @param {string} message - A descriptive error message.
   * @param {number} statusCode - The HTTP status code associated with the error (e.g., 400, 401, 404, 500).
   * @param {Array<Object>} [validationErrors=[]] - Optional: An array of validation errors, typically from express-validator.
   */
  constructor(message, statusCode, validationErrors = []) {
    super(message); // Call the parent Error constructor with the message

    this.statusCode = statusCode;
    // Determine the status string ('fail' for 4xx client errors, 'error' for 5xx server errors)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Mark as an operational error: true for errors we expect and handle gracefully (e.g., invalid input, not found),
    // false for programming errors (e.g., bugs, unhandled exceptions).
    this.isOperational = true;
    this.validationErrors = validationErrors; // Store specific validation error details

    // Capture the stack trace to help with debugging, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
