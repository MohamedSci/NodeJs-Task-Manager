// src/models/taskModel.js
// Simulates a task database using an in-memory array.
// In a real application, this would interact with a persistent database.

const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

// --- In-Memory "Database" for Tasks ---
// Added 'status' field: 'todo', 'in-progress', 'completed'
let tasks = [
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Complete Backend API",
    description: "Implement all CRUD operations and authentication.",
    completed: false,
    status: "in-progress",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Develop React Frontend",
    description: "Build UI for task management.",
    completed: false,
    status: "todo",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Write Tests",
    description: "Create UI and API automated tests.",
    completed: false,
    status: "todo",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Deploy Application",
    description: "Set up hosting for frontend and backend.",
    completed: false,
    status: "todo",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Review Code",
    description: "Perform a self-review of all code.",
    completed: false,
    status: "in-progress",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Prepare Documentation",
    description: "Write README and test plan.",
    completed: false,
    status: "completed",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Plan Next Features",
    description: "Brainstorm ideas for future enhancements.",
    completed: false,
    status: "todo",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Refactor Auth Module",
    description: "Improve JWT handling and error messages.",
    completed: false,
    status: "in-progress",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Optimize Database Queries",
    description: "If using a real DB, optimize queries.",
    completed: false,
    status: "todo",
  },
  {
    id: uuidv4(),
    userId: "testuser_id_placeholder",
    title: "Set up CI/CD",
    description: "Automate deployment pipeline.",
    completed: false,
    status: "todo",
  },
];

// Helper to update the placeholder userId with the actual ID of the seeded 'testuser'
// This ensures initial tasks are linked to the default user.
const userModel = require("./userModel"); // Import userModel to get the testuser's ID

function updateTaskUserIds() {
  const testUser = userModel.findByUsername("testuser");
  if (testUser) {
    tasks.forEach((task) => {
      if (task.userId === "testuser_id_placeholder") {
        task.userId = testUser.id;
      }
    });
  }
}

// Call this after userModel has seeded its user
// A small delay to ensure userModel is ready and the user ID is available.
// In a real app with a DB, this dependency would be handled by proper DB seeding scripts.
setTimeout(updateTaskUserIds, 100);

// --- Task Model Functions ---

// Finds all tasks for a given user ID.
exports.findByUserId = (userId) => {
  return tasks.filter((task) => task.userId === userId);
};

// Finds a single task by its ID.
exports.findById = (id) => {
  return tasks.find((task) => task.id === id);
};

// Creates a new task.
// Now accepts 'status' with a default value.
exports.create = ({
  userId,
  title,
  description,
  completed = false,
  status = "todo",
}) => {
  const newTask = {
    id: uuidv4(), // Generate a unique ID for the new task
    userId,
    title,
    description,
    completed,
    status, // Include the new status field
  };
  tasks.push(newTask);
  return newTask;
};

// Updates an existing task by ID.
// Now handles updates to the 'status' field.
exports.update = (id, updates) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
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
  tasks = tasks.filter((task) => task.id !== id);
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
