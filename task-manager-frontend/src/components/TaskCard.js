// src/components/TaskCard.js
// Renders a single task as a card within the dashboard grid.
// Allows for status changes (move to another column), editing, and deletion.
// Uses Lucide icons for visual actions.

import React from "react";
import {
  Edit,
  Trash2,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"; // Icons

const TaskCard = ({ task, onUpdateStatus, onEdit, onDelete }) => {
  // Determine card background and text color based on task status
  let cardBgClass = "bg-white";
  let statusTextColor = "text-gray-700";
  let statusIcon = null;

  switch (task.status) {
    case "todo":
      cardBgClass = "bg-blue-50 border-blue-200";
      statusTextColor = "text-blue-700";
      statusIcon = <Clock className="h-4 w-4 inline-block mr-1" />;
      break;
    case "in-progress":
      cardBgClass = "bg-yellow-50 border-yellow-200";
      statusTextColor = "text-yellow-700";
      statusIcon = <ChevronRight className="h-4 w-4 inline-block mr-1" />;
      break;
    case "completed":
      cardBgClass = "bg-green-50 border-green-200";
      statusTextColor = "text-green-700";
      statusIcon = <CheckCircle className="h-4 w-4 inline-block mr-1" />;
      break;
    default:
      cardBgClass = "bg-white border-gray-200";
      statusTextColor = "text-gray-700";
      statusIcon = <XCircle className="h-4 w-4 inline-block mr-1" />; // Fallback icon
  }

  // Determine if task is completed for line-through effect
  const isCompleted = task.status === "completed";

  return (
    <div
      className={`relative ${cardBgClass} p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col h-full`}
    >
      {/* Task Status Indicator */}
      <div
        className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg ${statusTextColor}`}
      >
        {statusIcon}
        {task.status.replace("-", " ").toUpperCase()}
      </div>

      {/* Task Content */}
      <div className="flex-grow mb-4 mt-6">
        {" "}
        {/* Added mt-6 to make space for status indicator */}
        <h3
          className={`text-lg font-semibold ${
            isCompleted ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={`text-sm text-gray-600 mt-1 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-auto border-t pt-3 border-gray-100">
        <div className="flex space-x-2">
          {/* Status Change Buttons (simplified for card) */}
          {task.status !== "todo" && (
            <button
              onClick={() => onUpdateStatus(task.id, "todo")}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
              title="Move to To Do"
            >
              To Do
            </button>
          )}
          {task.status !== "in-progress" && (
            <button
              onClick={() => onUpdateStatus(task.id, "in-progress")}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors duration-200"
              title="Move to In Progress"
            >
              In Progress
            </button>
          )}
          {task.status !== "completed" && (
            <button
              onClick={() => onUpdateStatus(task.id, "completed")}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
              title="Mark as Completed"
            >
              Completed
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit task"
            title="Edit Task"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete task"
            title="Delete Task"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
