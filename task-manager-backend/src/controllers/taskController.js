// src/controllers/taskController.js
// Handles CRUD operations for tasks.
// All these routes are protected by the `authMiddleware`, so `req.user` will be available.

const { validationResult } = require('express-validator');
const taskModel = require('../models/taskModel'); // Our mock task database
const AppError = require('../utils/AppError');

// GET /api/tasks
// Retrieves all tasks for the authenticated user.
exports.getAllTasks = (req, res, next) => {
    // req.user is available from the protect middleware
    const userId = req.user.id;
    const tasks = taskModel.findByUserId(userId);

    res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: {
            tasks,
        },
    });
};

// GET /api/tasks/:id
// Retrieves a single task by ID for the authenticated user.
exports.getTask = (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    const task = taskModel.findById(id);

    // Check if task exists and belongs to the authenticated user
    if (!task || task.userId !== userId) {
        return next(new AppError('No task found with that ID or you do not have permission.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            task,
        },
    });
};

// POST /api/tasks
// Creates a new task for the authenticated user.
exports.createTask = (req, res, next) => {
    // Validate request body using express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Validation failed', 400, errors.array()));
    }

    const { title, description, completed = false } = req.body;
    const userId = req.user.id; // Get user ID from authenticated request

    // Create the new task using the task model
    const newTask = taskModel.create({
        userId,
        title,
        description,
        completed,
    });

    res.status(201).json({
        status: 'success',
        data: {
            task: newTask,
        },
    });
};

// PUT /api/tasks/:id
// Updates an existing task for the authenticated user.
exports.updateTask = (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate request body using express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Validation failed', 400, errors.array()));
    }

    // Find the task and ensure it belongs to the user
    const existingTask = taskModel.findById(id);
    if (!existingTask || existingTask.userId !== userId) {
        return next(new AppError('No task found with that ID or you do not have permission to update it.', 404));
    }

    // Update the task using the task model
    const updatedTask = taskModel.update(id, req.body);

    res.status(200).json({
        status: 'success',
        data: {
            task: updatedTask,
        },
    });
};

// DELETE /api/tasks/:id
// Deletes a task for the authenticated user.
exports.deleteTask = (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the task and ensure it belongs to the user
    const existingTask = taskModel.findById(id);
    if (!existingTask || existingTask.userId !== userId) {
        return next(new AppError('No task found with that ID or you do not have permission to delete it.', 404));
    }

    // Delete the task using the task model
    taskModel.remove(id);

    res.status(204).json({ // 204 No Content for successful deletion
        status: 'success',
        data: null,
    });
};
