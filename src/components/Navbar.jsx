import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">TiendaERP</div>

      {/* Barra de búsqueda */}
      <div className="w-full max-w-md mx-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full px-4 py-2 rounded text-black"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <Link to="/login">
          <button className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-red-100 transition">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-white text-red-600 px-4 py-2 rounded font-semibold hover:bg-red-100 transition">
            Register
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
