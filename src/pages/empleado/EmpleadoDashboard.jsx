import Sidebar from "../../components/Sidebar";
import WidgetCard from "../../components/WidgetCard";

const EmpleadoDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold text-red-700 mb-8">
          Panel del Empleado
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WidgetCard titulo="Productos disponibles" valor="112" />
          <WidgetCard titulo="Mis ventas registradas" valor="47" />
        </div>
      </main>
    </div>
  );
};

export default EmpleadoDashboard;
