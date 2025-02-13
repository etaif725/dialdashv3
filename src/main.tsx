import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Check user's theme preference
const setTheme = () => {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.className = savedTheme;
    return;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.className = 'dark';
  } else {
    document.documentElement.className = ''; // Light theme is default
  }
};

// Set initial theme
setTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 