// src/components/TaskForm.js
// A reusable form component for creating new tasks or editing existing ones.
// It handles input fields, form submission, and displays validation errors.

import React, { useState, useEffect } from 'react';

const TaskForm = ({ initialTask = {}, onSubmit, onClose, errorMessage }) => {
  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [completed, setCompleted] = useState(initialTask.completed || false);
  const [loading, setLoading] = useState(false);

  // Effect to update form fields if initialTask changes (e.g., when editing a different task)
  useEffect(() => {
    setTitle(initialTask.title || '');
    setDescription(initialTask.description || '');
    setCompleted(initialTask.completed || false);
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
    };
    await onSubmit(taskData); // Call the onSubmit prop
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {initialTask.id ? 'Edit Task' : 'Create New Task'}
      </h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., Buy groceries"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., Milk, eggs, bread, vegetables"
        ></textarea>
      </div>
      <div className="flex items-center">
        <input
          id="completed"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
          Completed
        </label>
      </div>

      {errorMessage && (
        <div className="text-red-600 text-sm p-3 bg-red-100 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (initialTask.id ? 'Update Task' : 'Add Task')}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
