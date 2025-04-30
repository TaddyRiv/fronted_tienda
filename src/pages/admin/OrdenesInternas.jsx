import { useEffect, useState } from "react";

const OrdenesInternas = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [estado, setEstado] = useState(""); // Para capturar el estado seleccionado

  // Obtener todas las órdenes
  const fetchOrdenes = async () => {
    try {
      const res = await fetch("http://54.235.59.253/api/sales-orders");
      const data = await res.json();
      setOrdenes(data);
    } catch (err) {
      console.error("❌ Error al obtener órdenes:", err);
    }
  };

  // Función para actualizar el estado de la orden
  const actualizarEstado = async (id) => {
    try {
      const res = await fetch(`http://54.235.59.253/api/sales-orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado_entrega: estado }), // Enviamos el nuevo estado
      });

      if (res.ok) {
        alert("✅ Estado actualizado correctamente");
        fetchOrdenes(); // Recargar las órdenes después de la actualización
      } else {
        const error = await res.json();
        alert(error?.error || "❌ Error al actualizar estado");
      }
    } catch (err) {
      console.error("❌ Error al actualizar estado:", err);
      alert("❌ Error de conexión");
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Órdenes Internas</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Monto</th>
              <th className="p-2">Sucursal</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id} className="text-center border-b">
                <td className="p-2">{orden.id}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      orden.estado_entrega === "alistando pedido"
                        ? "bg-yellow-500"
                        : orden.estado_entrega === "en camino"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                  >
                    {orden.estado_entrega}
                  </span>
                </td>
                <td className="p-2">{orden.fecha}</td>
                <td className="p-2">{orden.total} Bs</td>
                <td className="p-2">{orden.sucursal_id}</td>
                <td className="p-2">
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)} // Cambiar estado
                    className="px-2 py-1 rounded"
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="alistando pedido">Alistando pedido</option>
                    <option value="en camino">En camino</option>
                    <option value="ya llego">Ya llegó</option>
                  </select>
                  <button
                    onClick={() => actualizarEstado(orden.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2"
                  >
                    Actualizar estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdenesInternas;
