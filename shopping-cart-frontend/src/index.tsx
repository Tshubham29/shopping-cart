import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import './index.css';

// Make sure the element exists and is typed correctly
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing in index.html');
}

const root = ReactDOM.createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
