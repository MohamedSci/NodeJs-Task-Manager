// src/components/TaskForm.js
// A reusable form component for creating new tasks or editing existing ones.
// It handles input fields, form submission, and displays validation errors.

import React, { useState, useEffect } from "react";

const TaskForm = ({ initialTask = {}, onSubmit, onClose, errorMessage }) => {
  const [title, setTitle] = useState(initialTask.title || "");
  const [description, setDescription] = useState(initialTask.description || "");
  const [completed, setCompleted] = useState(initialTask.completed || false);
  const [status, setStatus] = useState(initialTask.status || "todo"); // New status state
  const [loading, setLoading] = useState(false);

  // Effect to update form fields if initialTask changes (e.g., when editing a different task)
  useEffect(() => {
    setTitle(initialTask.title || "");
    setDescription(initialTask.description || "");
    setCompleted(initialTask.completed || false);
    setStatus(initialTask.status || "todo"); // Update status when initialTask changes
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Construct task data, including the ID if it's an existing task
    const taskData = {
      id: initialTask.id, // Will be undefined for new tasks, present for existing
      title,
      description,
      completed,
      status, // Include status in submitted data
    };
    await onSubmit(taskData); // Call the onSubmit prop
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-2">
      {" "}
      {/* Reduced padding here, modal handles overall */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
          placeholder="e.g., Buy groceries"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 resize-y"
          placeholder="e.g., Milk, eggs, bread, vegetables"
        ></textarea>
      </div>
      <div className="flex items-center">
        <input
          id="completed"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
        />
        <label
          htmlFor="completed"
          className="ml-2 block text-base text-gray-900 cursor-pointer"
        >
          Mark as Completed
        </label>
      </div>
      {/* New Status Dropdown */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {errorMessage && (
        <div className="text-red-700 text-sm p-3 bg-red-100 rounded-md border border-red-200 animate-pulse-once">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-100"
        >
          {loading ? "Saving..." : initialTask.id ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
