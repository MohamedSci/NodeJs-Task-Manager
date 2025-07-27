// src/components/AuthForm.js
// A reusable component for user authentication forms (login or register).
// It handles input fields, form submission, and displays error messages.

import React, { useState } from "react";

const AuthForm = ({ onSubmit, isRegister, errorMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Call the onSubmit prop, which will handle the actual API call (login/register)
    await onSubmit(username, password);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-left">
        {" "}
        {/* Added text-left for label alignment */}
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
          placeholder="Enter your username"
        />
      </div>
      <div className="text-left">
        {" "}
        {/* Added text-left for label alignment */}
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
          placeholder="Enter your password"
        />
      </div>

      {errorMessage && (
        <div className="text-red-700 text-sm p-3 bg-red-100 rounded-md border border-red-200 animate-pulse-once">
          {errorMessage}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-100"
        >
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;