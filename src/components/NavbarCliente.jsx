import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

const NavbarCliente = () => {
  const { carrito } = useContext(CarritoContext);
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // Eliminamos solo el token y el user, no el carrito
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-red-700 text-white px-6 py-4 flex items-center justify-between shadow">
      <h1 className="text-2xl font-bold">TiendaERP</h1>
      <ul className="flex items-center space-x-6 text-lg">
        <li>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/cliente/catalogo" className="hover:underline">
            Catálogo
          </Link>
        </li>
        <li>
          <Link to="/cliente/carrito" className="hover:underline">
            🛒 Carrito
            <span className="ml-1 bg-white text-red-700 px-2 py-0.5 rounded-full text-sm font-bold">
              {cantidad}
            </span>
          </Link>
        </li>
        <li>
          <Link to="/perfil" className="hover:underline">
            Mi perfil
          </Link>
        </li>
        <li>
          <button
            onClick={cerrarSesion}
            className="bg-white text-red-700 font-bold px-3 py-1 rounded hover:bg-red-200"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarCliente;
