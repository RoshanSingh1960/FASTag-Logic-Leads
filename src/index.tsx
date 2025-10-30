import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // <--- Ensure this import exists

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// This is the CRUCIAL line for enabling PWA (Service Worker)
serviceWorkerRegistration.register(); 

// If you have reportWebVitals, leave it as is
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();