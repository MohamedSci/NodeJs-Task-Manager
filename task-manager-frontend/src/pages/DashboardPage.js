// src/pages/DashboardPage.js
// This is the main dashboard where users can view, add, edit, and delete tasks.
// It fetches tasks from the backend, manages local state for tasks and modal visibility,
// implements pagination, and displays tasks in a 3-column grid based on status.

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/api";
import TaskCard from "../components/TaskCard"; // Renamed from TaskItem
import TaskForm from "../components/TaskForm";
import Modal from "../components/Modal";
import { PlusCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react"; // Icons

const TASKS_PER_PAGE = 15; // Max count of tasks per page

const DashboardPage = () => {
  const { token, user, logout } = useAuth();
  const [allTasks, setAllTasks] = useState([]); // Stores all tasks fetched from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Fetches tasks from the backend API.
   * Memoized to prevent unnecessary re-renders.
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTasks(token);
      setAllTasks(response.data.tasks); // Store all tasks
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err.message || "Failed to load tasks. Please try again.");
      if (err.statusCode === 401 || err.statusCode === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  // Handle opening the modal for creating a new task
  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
    setError("");
  };

  // Handle opening the modal for editing an existing task
  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setError("");
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setError("");
  };

  // Handle form submission for creating or updating a task
  const handleTaskSubmit = async (taskData) => {
    setError("");
    try {
      if (taskData.id) {
        await updateTask(taskData.id, taskData, token);
      } else {
        await createTask(taskData, token);
      }
      fetchTasks(); // Re-fetch all tasks to update the list
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save task:", err);
      const validationErrors = err.validationErrors
        ? err.validationErrors.map((e) => Object.values(e)).join(", ")
        : "";
      setError(
        err.message + (validationErrors ? ` (${validationErrors})` : "")
      );
    }
  };

  // Handle updating task status directly from card
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setError("");
    try {
      await updateTask(taskId, { status: newStatus }, token);
      fetchTasks(); // Re-fetch tasks to update the list
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError(err.message || "Failed to update task status.");
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      setError("");
      try {
        await deleteTask(taskId, token);
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task:", err);
        setError(err.message || "Failed to delete task.");
      }
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(allTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;

  const paginatedTasks = allTasks.slice(startIndex, endIndex);

  // Filter paginated tasks into three status categories
  const todoTasks = paginatedTasks.filter((task) => task.status === "todo");
  const inProgressTasks = paginatedTasks.filter(
    (task) => task.status === "in-progress"
  );
  const completedTasks = paginatedTasks.filter(
    (task) => task.status === "completed"
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            Welcome, {user ? user.username : "Guest"}!
          </h1>
          <button
            onClick={logout}
            className="flex items-center px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>

        {/* Fixed Add New Task Button and Pagination */}
        <div className="sticky top-0 z-10 bg-white bg-opacity-95 py-4 mb-6 border-b border-gray-200 rounded-b-lg shadow-sm flex flex-col sm:flex-row justify-between items-center px-6 -mx-6">
          <button
            onClick={handleAddTaskClick}
            className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105 w-full sm:w-auto mb-4 sm:mb-0"
            aria-label="Add new task"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Task
          </button>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2 text-gray-700">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Global Error Display */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow-sm"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {/* Loading State Indicator */}
        {loading && (
          <div className="text-center text-gray-600 py-12">
            <p className="mb-3 text-lg">Loading tasks, please wait...</p>
            <div className="mt-4 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {/* Task Grid Layout */}
        {!loading && allTasks.length === 0 && (
          <p className="text-center text-gray-500 py-12 text-lg">
            No tasks found. Click "Add New Task" to get started!
          </p>
        )}

        {!loading && allTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200 h-full flex flex-col">
              <h2 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b border-blue-300">
                To Do ({todoTasks.length})
              </h2>
              <div className="flex-grow space-y-4">
                {todoTasks.length > 0 ? (
                  todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={handleUpdateTaskStatus}
                      onEdit={handleEditTaskClick}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <p className="text-center text-blue-600 text-sm py-4">
                    No tasks in this category.
                  </p>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-yellow-50 p-4 rounded-lg shadow-inner border border-yellow-200 h-full flex flex-col">
              <h2 className="text-xl font-bold text-yellow-800 mb-4 pb-2 border-b border-yellow-300">
                In Progress ({inProgressTasks.length})
              </h2>
              <div className="flex-grow space-y-4">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={handleUpdateTaskStatus}
                      onEdit={handleEditTaskClick}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <p className="text-center text-yellow-600 text-sm py-4">
                    No tasks in this category.
                  </p>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-green-50 p-4 rounded-lg shadow-inner border border-green-200 h-full flex flex-col">
              <h2 className="text-xl font-bold text-green-800 mb-4 pb-2 border-b border-green-300">
                Completed ({completedTasks.length})
              </h2>
              <div className="flex-grow space-y-4">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={handleUpdateTaskStatus}
                      onEdit={handleEditTaskClick}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <p className="text-center text-green-600 text-sm py-4">
                    No tasks in this category.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTask ? "Edit Task" : "Create New Task"}
        >
          <TaskForm
            initialTask={editingTask || {}}
            onSubmit={handleTaskSubmit}
            onClose={handleCloseModal}
            errorMessage={error}
          />
        </Modal>
      </div>
    </div>
  );
};

export default DashboardPage;