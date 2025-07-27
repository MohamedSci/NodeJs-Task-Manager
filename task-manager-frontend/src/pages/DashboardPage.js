// src/pages/DashboardPage.js
// This is the main dashboard where users can view, add, edit, and delete tasks.
// It fetches tasks from the backend and manages local state for tasks and modal visibility.

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../api/api';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import { PlusCircle, LogOut } from 'lucide-react'; // Icons from lucide-react for a modern look

const DashboardPage = () => {
  // Destructure authentication state and functions from AuthContext
  const { token, user, logout } = useAuth();

  // State for managing tasks, loading status, and errors
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for modal visibility and the task currently being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Stores the task object when editing

  /**
   * Fetches tasks from the backend API.
   * This function is memoized using useCallback to prevent unnecessary re-renders
   * and ensure it's only recreated if `token` or `logout` dependencies change.
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true); // Set loading state to true before fetching
    setError(''); // Clear any previous errors
    try {
      // Make API call to get tasks, passing the authentication token
      const response = await getTasks(token);
      // Assuming API returns { data: { tasks: [...] } }
      setTasks(response.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      // Display a user-friendly error message
      setError(err.message || 'Failed to load tasks. Please try again.');
      // If authentication fails (401/403), log the user out
      if (err.statusCode === 401 || err.statusCode === 403) {
        logout();
      }
    } finally {
      setLoading(false); // Set loading state to false after fetch attempt
    }
  }, [token, logout]); // Dependencies for useCallback

  // useEffect hook to fetch tasks when the component mounts or the token changes
  useEffect(() => {
    if (token) { // Only fetch tasks if a token exists (user is authenticated)
      fetchTasks();
    }
  }, [token, fetchTasks]); // Dependencies for useEffect

  /**
   * Handles opening the modal for creating a new task.
   */
  const handleAddTaskClick = () => {
    setEditingTask(null); // Ensure no task is set for editing
    setIsModalOpen(true); // Open the modal
    setError(''); // Clear any form-specific errors
  };

  /**
   * Handles opening the modal for editing an existing task.
   * @param {Object} task - The task object to be edited.
   */
  const handleEditTaskClick = (task) => {
    setEditingTask(task); // Set the task to be edited
    setIsModalOpen(true); // Open the modal
    setError(''); // Clear any form-specific errors
  };

  /**
   * Handles closing the modal.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setEditingTask(null); // Clear the editing task state
    setError(''); // Clear any form-specific errors
  };

  /**
   * Handles form submission for creating or updating a task.
   * @param {Object} taskData - The data for the task (includes ID if editing).
   */
  const handleTaskSubmit = async (taskData) => {
    setError(''); // Clear previous errors from the form
    try {
      if (taskData.id) {
        // If taskData has an ID, it's an update operation
        await updateTask(taskData.id, taskData, token);
      } else {
        // Otherwise, it's a create operation
        await createTask(taskData, token);
      }
      fetchTasks(); // Re-fetch all tasks to update the list on success
      handleCloseModal(); // Close the modal after successful submission
    } catch (err) {
      console.error('Failed to save task:', err);
      // Construct a detailed error message, including validation errors if present
      const validationErrors = err.validationErrors ? err.validationErrors.map(e => Object.values(e)).join(', ') : '';
      setError(err.message + (validationErrors ? ` (${validationErrors})` : ''));
    }
  };

  /**
   * Handles toggling the completion status of a task.
   * @param {string} taskId - The ID of the task to update.
   * @param {boolean} completed - The new completion status.
   */
  const handleToggleComplete = async (taskId, completed) => {
    setError(''); // Clear previous errors
    try {
      await updateTask(taskId, { completed }, token); // Update task completion status
      fetchTasks(); // Re-fetch tasks to reflect the change
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
      setError(err.message || 'Failed to update task status.');
    }
  };

  /**
   * Handles deleting a task.
   * @param {string} taskId - The ID of the task to delete.
   */
  const handleDeleteTask = async (taskId) => {
    // Confirm deletion with the user
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      setError(''); // Clear previous errors
      try {
        await deleteTask(taskId, token); // Delete the task
        fetchTasks(); // Re-fetch tasks to update the list
      } catch (err) {
        console.error('Failed to delete task:', err);
        setError(err.message || 'Failed to delete task.');
      }
    }
  };

  // Filter tasks into two categories: incomplete and completed
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user ? user.username : 'Guest'}!
          </h1>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>

        {/* Add New Task Button */}
        <div className="mb-6">
          <button
            onClick={handleAddTaskClick}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Add new task"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Task
          </button>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {/* Loading State Indicator */}
        {loading && (
          <div className="text-center text-gray-600 py-8">
            <p className="mb-3">Loading tasks, please wait...</p>
            {/* Simple Tailwind CSS spinner animation */}
            <div className="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {/* Conditional Rendering for Task Lists */}
        {!loading && (
          <>
            {/* Incomplete Tasks Section */}
            {incompleteTasks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Tasks ({incompleteTasks.length})</h2>
                <div className="space-y-3" aria-label="Pending tasks list">
                  {incompleteTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTaskClick}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Message when no tasks are found */}
            {incompleteTasks.length === 0 && completedTasks.length === 0 && (
                <p className="text-center text-gray-500 py-8">No tasks found. Click "Add New Task" to get started!</p>
            )}

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Completed Tasks ({completedTasks.length})</h2>
                <div className="space-y-3" aria-label="Completed tasks list">
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTaskClick}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Task Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        >
          <TaskForm
            initialTask={editingTask || {}} // Pass the task being edited or an empty object for new tasks
            onSubmit={handleTaskSubmit}
            onClose={handleCloseModal}
            errorMessage={error} // Pass error message to the form for display
          />
        </Modal>
      </div>
    </div>
  );
};

export default DashboardPage;
