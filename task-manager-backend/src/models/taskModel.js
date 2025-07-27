// src/models/taskModel.js
// Simulates a task database using an in-memory array.
// In a real application, this would interact with a persistent database.

const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// --- In-Memory "Database" for Tasks ---
let tasks = [
    { id: uuidv4(), userId: 'testuser_id_placeholder', title: 'Complete Backend API', description: 'Implement all CRUD operations and authentication.', completed: false },
    { id: uuidv4(), userId: 'testuser_id_placeholder', title: 'Develop React Frontend', description: 'Build UI for task management.', completed: false },
    { id: uuidv4(), userId: 'testuser_id_placeholder', title: 'Write Tests', description: 'Create UI and API automated tests.', completed: false },
];

// Helper to update the placeholder userId with the actual ID of the seeded 'testuser'
// This ensures initial tasks are linked to the default user.
const userModel = require('./userModel'); // Import userModel to get the testuser's ID

function updateTaskUserIds() {
    const testUser = userModel.findByUsername('testuser');
    if (testUser) {
        tasks.forEach(task => {
            if (task.userId === 'testuser_id_placeholder') {
                task.userId = testUser.id;
            }
        });
    }
}

// Call this after userModel has seeded its user
setTimeout(updateTaskUserIds, 100); // Small delay to ensure userModel is ready

// --- Task Model Functions ---

// Finds all tasks for a given user ID.
exports.findByUserId = (userId) => {
    return tasks.filter(task => task.userId === userId);
};

// Finds a single task by its ID.
exports.findById = (id) => {
    return tasks.find(task => task.id === id);
};

// Creates a new task.
exports.create = ({ userId, title, description, completed }) => {
    const newTask = {
        id: uuidv4(), // Generate a unique ID for the new task
        userId,
        title,
        description,
        completed,
    };
    tasks.push(newTask);
    return newTask;
};

// Updates an existing task by ID.
exports.update = (id, updates) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return null; // Task not found
    }

    // Apply updates, ensuring ID and userId are not changed
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        id: tasks[taskIndex].id, // Ensure ID is not changed
        userId: tasks[taskIndex].userId, // Ensure userId is not changed
    };
    return tasks[taskIndex];
};

// Removes a task by ID.
exports.remove = (id) => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return tasks.length < initialLength; // Returns true if a task was removed
};

// For testing purposes, you might need to clear or reset tasks
exports.clearAll = () => {
    tasks = [];
    // Optionally re-seed default tasks if needed for specific tests
};

exports.getAllTasks = () => {
    return [...tasks]; // Return a copy to prevent external modification
};
