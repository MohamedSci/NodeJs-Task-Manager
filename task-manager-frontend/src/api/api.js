// src/api/api.js
// Centralized utility for making API requests to the backend.
// Handles token attachment and common error responses.

const API_BASE_URL = "http://localhost:3001/api"; // Ensure this matches your Node.js backend port

/**
 * Helper function to handle API responses.
 * Throws an error if the response is not OK.
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<Object>} The parsed JSON response.
 * @throws {Error} If the response status is not OK.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.message || "Something went wrong on the server.";
    // Include validation errors if available
    const validationErrors = errorData.validationErrors || [];
    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.validationErrors = validationErrors;
    throw error;
  }
  return response.json();
};

/**
 * Makes an authenticated API request.
 * @param {string} endpoint - The API endpoint (e.g., '/tasks').
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {Object} [body=null] - The request body for POST/PUT requests.
 * @param {string} [token=null] - The authentication token.
 * @returns {Promise<Object>} The parsed JSON response.
 */
const request = async (endpoint, method, body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error; // Re-throw to be caught by the calling component/context
  }
};

// --- Authentication API Calls ---

/**
 * Logs in a user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} Login response containing token and user info.
 */
export const loginUser = (username, password) =>
  request("/auth/login", "POST", { username, password });

/**
 * Registers a new user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} Registration response containing token and user info.
 */
export const registerUser = (username, password) =>
  request("/auth/register", "POST", { username, password });

// --- Task API Calls ---

/**
 * Fetches all tasks for the authenticated user.
 * @param {string} token
 * @returns {Promise<Array<Object>>} Array of tasks.
 */
export const getTasks = (token) => request("/tasks", "GET", null, token);

/**
 * Creates a new task.
 * @param {Object} taskData - { title, description, completed, status }
 * @param {string} token
 * @returns {Promise<Object>} The created task.
 */
export const createTask = (taskData, token) =>
  request("/tasks", "POST", taskData, token);

/**
 * Updates an existing task.
 * @param {string} taskId
 * @param {Object} taskData - { title, description, completed, status }
 * @param {string} token
 * @returns {Promise<Object>} The updated task.
 */
export const updateTask = (taskId, taskData, token) =>
  request(`/tasks/${taskId}`, "PUT", taskData, token);

/**
 * Deletes a task.
 * @param {string} taskId
 * @param {string} token
 * @returns {Promise<void>}
 */
export const deleteTask = (taskId, token) =>
  request(`/tasks/${taskId}`, "DELETE", null, token);

// // src/api/api.js
// // Centralized utility for making API requests to the backend.
// // Handles token attachment and common error responses.

// const API_BASE_URL = 'http://localhost:3001/api'; // Ensure this matches your Node.js backend port

// /**
//  * Helper function to handle API responses.
//  * Throws an error if the response is not OK.
//  * @param {Response} response - The fetch API response object.
//  * @returns {Promise<Object>} The parsed JSON response.
//  * @throws {Error} If the response status is not OK.
//  */
// const handleResponse = async (response) => {
//     if (!response.ok) {
//         const errorData = await response.json();
//         const errorMessage = errorData.message || 'Something went wrong on the server.';
//         // Include validation errors if available
//         const validationErrors = errorData.validationErrors || [];
//         const error = new Error(errorMessage);
//         error.statusCode = response.status;
//         error.validationErrors = validationErrors;
//         throw error;
//     }
//     return response.json();
// };

// /**
//  * Makes an authenticated API request.
//  * @param {string} endpoint - The API endpoint (e.g., '/tasks').
//  * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
//  * @param {Object} [body=null] - The request body for POST/PUT requests.
//  * @param {string} [token=null] - The authentication token.
//  * @returns {Promise<Object>} The parsed JSON response.
//  */
// const request = async (endpoint, method, body = null, token = null) => {
//     const headers = {
//         'Content-Type': 'application/json',
//     };

//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     const config = {
//         method,
//         headers,
//         body: body ? JSON.stringify(body) : null,
//     };

//     try {
//         const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
//         return handleResponse(response);
//     } catch (error) {
//         console.error(`API request failed for ${endpoint}:`, error);
//         throw error; // Re-throw to be caught by the calling component/context
//     }
// };

// // --- Authentication API Calls ---

// /**
//  * Logs in a user.
//  * @param {string} username
//  * @param {string} password
//  * @returns {Promise<Object>} Login response containing token and user info.
//  */
// export const loginUser = (username, password) =>
//     request('/auth/login', 'POST', { username, password });

// /**
//  * Registers a new user.
//  * @param {string} username
//  * @param {string} password
//  * @returns {Promise<Object>} Registration response containing token and user info.
//  */
// export const registerUser = (username, password) =>
//     request('/auth/register', 'POST', { username, password });

// // --- Task API Calls ---

// /**
//  * Fetches all tasks for the authenticated user.
//  * @param {string} token
//  * @returns {Promise<Array<Object>>} Array of tasks.
//  */
// export const getTasks = (token) =>
//     request('/tasks', 'GET', null, token);

// /**
//  * Creates a new task.
//  * @param {Object} taskData - { title, description, completed }
//  * @param {string} token
//  * @returns {Promise<Object>} The created task.
//  */
// export const createTask = (taskData, token) =>
//     request('/tasks', 'POST', taskData, token);

// /**
//  * Updates an existing task.
//  * @param {string} taskId
//  * @param {Object} taskData - { title, description, completed }
//  * @param {string} token
//  * @returns {Promise<Object>} The updated task.
//  */
// export const updateTask = (taskId, taskData, token) =>
//     request(`/tasks/${taskId}`, 'PUT', taskData, token);

// /**
//  * Deletes a task.
//  * @param {string} taskId
//  * @param {string} token
//  * @returns {Promise<void>}
//  */
// export const deleteTask = (taskId, token) =>
//     request(`/tasks/${taskId}`, 'DELETE', null, token);
