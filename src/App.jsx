import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Usuarios from "./pages/admin/Usuarios";
import Categorias from "./pages/admin/Categorias";
import Productos from "./pages/admin/Productos";
import CatalogoCliente from "./pages/cliente/CatalogoCliente";
import Carrito from "./pages/cliente/Carrito";
import FinalizarCompra from "./pages/cliente/FinalizarCompra";
import NotasVenta from "./pages/admin/NotasVenta";
import OrdenesInternas from "./pages/admin/OrdenesInternas";
import OrderDetails from "./pages/admin/OrderDetails";
import PagoExitoso from "./pages/cliente/PagoExitoso";
import CrearOrden from "./pages/admin/CrearOrden";

// Cargar Stripe Promise
const stripePromise = loadStripe("pk_test_51RHROzCrWG5rpklusUtAkQPaRU7wMVNVUIZ7baeX0czL8wBJHE59F1Qlw5WwzYSMzZn3a2VtpH6ys8mORxxnwuIT00VSqJYP4M");

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>

          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Rutas de administrador */}
          <Route path="/admin/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
          <Route path="/admin/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
          <Route path="/admin/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
          <Route path="/admin/notas-venta" element={<PrivateRoute><NotasVenta /></PrivateRoute>} />
          <Route path="/admin/ordenes" element={<PrivateRoute><OrdenesInternas /></PrivateRoute>} />
          <Route path="/admin/detalles" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
          <Route path="/admin/crear-orden" element={<PrivateRoute><CrearOrden /></PrivateRoute>} /> {/* ✅ Agregado */}

          {/* Rutas de cliente */}
          <Route path="/cliente/catalogo" element={<PrivateRoute><CatalogoCliente /></PrivateRoute>} />
          <Route path="/cliente/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
          <Route path="/cliente/finalizar" element={<PrivateRoute><FinalizarCompra /></PrivateRoute>} />

          {/* Redirección luego de pago exitoso */}
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          
        </Routes>
      </Elements>
    </BrowserRouter>
  );
}

export default App;
