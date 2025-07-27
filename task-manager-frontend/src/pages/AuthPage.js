// src/pages/AuthPage.js
// This page handles user authentication (login and registration).
// It uses the AuthContext to manage authentication state and API calls.

import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, register } = useAuth(); // Get login and register functions from AuthContext

  // Handles form submission for both login and registration
  const handleAuthSubmit = async (username, password) => {
    setErrorMessage(''); // Clear previous errors

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegisterMode ? 'Create an account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              {isRegisterMode ? 'Login to an existing account' : 'Register a new account'}
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
