// src/index.js
// This is the entry point of the React application.
// It renders the main App component into the 'root' div in index.html.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import Tailwind CSS
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

// Create a root for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in AuthProvider for global authentication state
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
