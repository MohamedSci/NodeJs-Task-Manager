// src/App.js
// This is the main application component, serving as the root of our React application.
// Its primary responsibility is to manage the top-level routing based on the user's
// authentication status, ensuring that unauthenticated users are directed to the
// login/registration page, while authenticated users access the main dashboard.

import React from 'react';
import { useAuth } from './contexts/AuthContext'; // Import the custom hook to access authentication context
import AuthPage from './pages/AuthPage';           // Import the authentication page component
import DashboardPage from './pages/DashboardPage'; // Import the dashboard page component

const App = () => {
  // Destructure `isAuthenticated` and `loading` states from our AuthContext.
  // `isAuthenticated` tells us if a user is logged in.
  // `loading` indicates if the initial authentication check (e.g., from localStorage) is still in progress.
  const { isAuthenticated, loading } = useAuth();

  // --- Initial Loading State ---
  // If the authentication context is still loading (e.g., checking localStorage for a token),
  // display a loading indicator to prevent flashing unauthenticated content.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-inter">
        <div className="text-xl text-gray-700 mb-4">Loading application...</div>
        {/* A simple Tailwind CSS spinner for visual feedback */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  // --- Conditional Rendering (Simple Routing) ---
  // Once the loading state is complete, we conditionally render the appropriate page.
  // This acts as a basic client-side router, directing users based on their login status.
  if (isAuthenticated) {
    // If the user is authenticated, render the DashboardPage.
    return <DashboardPage />;
  } else {
    // If the user is not authenticated, render the AuthPage (login/register).
    return <AuthPage />;
  }
};

export default App;
