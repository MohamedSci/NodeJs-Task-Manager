// server.js
// Main entry point for the Node.js Task Manager Backend.
// Sets up Express, loads environment variables, applies middleware,
// registers routes, and handles global errors.

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const errorHandler = require('./src/utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001

// --- Middleware ---

// Enable CORS for all origins (for development).
// In production, you'd restrict this to your frontend's domain.
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// --- Routes ---
// Register authentication routes
app.use('/api/auth', authRoutes);
// Register task routes (prefixed with /api/tasks)
app.use('/api/tasks', taskRoutes);

// --- Global Error Handling Middleware ---
// This middleware catches any errors thrown by route handlers or other middleware.
app.use(errorHandler);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access backend at http://localhost:${PORT}`);
});
