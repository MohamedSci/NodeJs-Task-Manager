// src/models/userModel.js
// Simulates a user database using an in-memory array.
// In a real application, this would interact with a persistent database (e.g., MongoDB, PostgreSQL).

const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const bcrypt = require('bcryptjs'); // For initial password hashing (if seeding)

// --- In-Memory "Database" for Users ---
let users = [];

// Seed initial user for testing purposes
async function seedUsers() {
    // Check if the default user already exists to prevent duplicates on server restart
    if (!users.find(u => u.username === 'testuser')) {
        const hashedPassword = await bcrypt.hash('password123', 12); // Hash the default password
        users.push({
            id: uuidv4(),
            username: 'testuser',
            password: hashedPassword,
        });
        console.log('Default user "testuser" seeded.');
    }
}
seedUsers(); // Call seed function on module load

// --- User Model Functions ---

// Finds a user by their ID.
exports.findById = (id) => {
    return users.find(user => user.id === id);
};

// Finds a user by their username.
exports.findByUsername = (username) => {
    return users.find(user => user.username === username);
};

// Creates a new user and adds them to the "database".
exports.create = ({ username, password }) => {
    const newUser = {
        id: uuidv4(), // Generate a unique ID for the new user
        username,
        password, // Password should already be hashed by the controller
    };
    users.push(newUser);
    return newUser;
};

// For testing purposes, you might need to clear or reset users
exports.clearAll = () => {
    users = [];
    seedUsers(); // Re-seed default user after clearing
};

exports.getAllUsers = () => {
    return [...users]; // Return a copy to prevent external modification
};
