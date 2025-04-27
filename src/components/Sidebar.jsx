import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-red-700 text-white w-64 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10">TiendaERP</h2>
      <nav className="flex flex-col gap-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-10 bg-white text-red-700 px-4 py-2 rounded hover:bg-red-200"
        >
          Cerrar sesión
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
