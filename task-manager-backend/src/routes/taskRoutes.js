// src/routes/taskRoutes.js
// Defines API routes for task management (CRUD operations).
// All these routes are protected by the `protect` middleware.

const express = require('express');
const { body, param } = require('express-validator'); // For input validation
const taskController = require('../controllers/taskController');
const protect = require('../auth/authMiddleware'); // Authentication middleware
const validate = require('../utils/validation'); // Custom validation middleware

const router = express.Router();

// All routes below this line will be protected by the JWT authentication middleware
router.use(protect);

// GET /api/tasks
// Retrieves all tasks for the authenticated user.
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id
// Retrieves a single task by ID.
router.get('/:id',
    [
        param('id').isUUID().withMessage('Task ID must be a valid UUID'),
    ],
    validate,
    taskController.getTask
);

// POST /api/tasks
// Creates a new task.
router.post(
    '/',
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters long')
            .trim()
            .escape(),
        body('description').optional().trim().escape(),
        body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    ],
    validate,
    taskController.createTask
);

// PUT /api/tasks/:id
// Updates an existing task.
router.put(
    '/:id',
    [
        param('id').isUUID().withMessage('Task ID must be a valid UUID'),
        body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long').trim().escape(),
        body('description').optional().trim().escape(),
        body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    ],
    validate,
    taskController.updateTask
);

// DELETE /api/tasks/:id
// Deletes a task.
router.delete(
    '/:id',
    [
        param('id').isUUID().withMessage('Task ID must be a valid UUID'),
    ],
    validate,
    taskController.deleteTask
);

module.exports = router;
