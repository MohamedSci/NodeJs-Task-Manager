// src/components/TaskItem.js
// Renders a single task item, allowing for completion toggling, editing, and deletion.
// Uses Lucide icons for visual actions.

import React from 'react';
import { CheckSquare, Square, Edit, Trash2 } from 'lucide-react'; // Icons from lucide-react

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200">
      <div className="flex items-center flex-grow">
        {/* Toggle complete icon */}
        <button
          onClick={() => onToggleComplete(task.id, !task.completed)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckSquare className="h-6 w-6 text-green-500" />
          ) : (
            <Square className="h-6 w-6 text-gray-400" />
          )}
        </button>

        {/* Task details */}
        <div className="ml-4 flex-grow">
          <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          aria-label="Edit task"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors duration-200"
          aria-label="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
