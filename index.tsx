import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Remove loading screen after successful render
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
    console.log("TrelloLite Pro mounted successfully.");
  } catch (err) {
    console.error("Critical mounting error:", err);
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.innerHTML = `
        <div class="text-center p-8">
          <h1 class="text-red-600 font-bold text-xl mb-2">Failed to load application</h1>
          <p class="text-slate-500 text-sm">Please check the console for details or refresh the page.</p>
        </div>
      `;
    }
  }
};

mountApp();