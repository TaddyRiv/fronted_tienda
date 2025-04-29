import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CarritoProvider } from './context/CarritoContext'; // Proveedor de carrito


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarritoProvider> {/* Proveedor de carrito */}
        <App />
    </CarritoProvider>
  </React.StrictMode>
);
