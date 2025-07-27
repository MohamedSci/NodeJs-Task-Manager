// src/pages/AuthPage.js
// This page handles user authentication (login and registration).
// It uses the AuthContext to manage authentication state and API calls.

import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../contexts/AuthContext";

const AuthPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, register } = useAuth(); // Get login and register functions from AuthContext

  // Handles form submission for both login and registration
  const handleAuthSubmit = async (username, password) => {
    setErrorMessage(""); // Clear previous errors

    let result;
    if (isRegisterMode) {
      result = await register(username, password);
    } else {
      result = await login(username, password);
    }

    if (!result.success) {
      setErrorMessage(result.message); // Display error message from the auth context
    }
    // If successful, AuthContext will update, and App.js will redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 drop-shadow-sm">
            {isRegisterMode ? "Create Your Account" : "Welcome Back!"}
          </h2>
          <p className="mt-4 text-center text-md text-gray-600">
            {isRegisterMode
              ? "Join us to manage your tasks efficiently."
              : "Sign in to continue managing your tasks."}
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage(""); // Clear error when switching modes
              }}
              className="font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none"
            >
              {isRegisterMode
                ? "Login to an existing account"
                : "Register a new account"}
            </button>
          </p>
        </div>
        <AuthForm
          onSubmit={handleAuthSubmit}
          isRegister={isRegisterMode}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

export default AuthPage;
