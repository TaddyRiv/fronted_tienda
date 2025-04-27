import { useEffect, useState } from "react";
import AdminDashboard from "./admin/AdminDashboard";
import EmpleadoDashboard from "./empleado/EmpleadoDashboard";
import ClienteDashboard from "./cliente/ClienteDashboard";

const Dashboard = () => {
  const [rolId, setRolId] = useState(null); // ✅ ESTO ES CLAVE

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("ROL DETECTADO:", user?.rol_id);
    setRolId(user?.rol_id);
  }, []);

  if (!rolId) return <p className="p-10">Cargando...</p>;

  switch (rolId) {
    case 1:
      return <AdminDashboard />;
    case 2:
      return <EmpleadoDashboard />;
    case 3:
      return <ClienteDashboard />;
    default:
      return (
        <div className="p-10 text-red-600">
          Rol no reconocido o no autorizado.
        </div>
      );
  }
};

export default Dashboard;
