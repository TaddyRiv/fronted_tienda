import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";


const seccionesAdmin = [
  { titulo: "Crear Orden", icono: "📊", ruta: "/admin/crear-orden" },
  { titulo: "Gestión de usuarios", icono: "🧑", ruta: "/admin/usuarios" },
  { titulo: "Gestión de productos", icono: "📦", ruta: "/admin/productos" },
  { titulo: "Categorías", icono: "📂", ruta: "/admin/categorias" },
  { titulo: "Notas de venta", icono: "💸", ruta: "/admin/notas-venta" },
  { titulo: "Órdenes", icono: "🧾", ruta: "/admin/ordenes" },
  { titulo: "Detalles", icono: "🛒", ruta: "/admin/detalles" },
];

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold text-red-700 mb-8">
          Panel del Administrador
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seccionesAdmin.map((seccion, i) => (
            <Link key={i} to={seccion.ruta}>
              <div className="bg-white border-t-4 border-red-600 shadow-lg rounded-lg p-6 hover:shadow-xl hover:scale-105 transition">
                <div className="text-4xl mb-2">{seccion.icono}</div>
                <div className="text-xl font-semibold text-red-700">
                  {seccion.titulo}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
