import { useEffect, useState } from "react";

const NotasVenta = () => {
  const [ventas, setVentas] = useState([]);

  const fetchVentas = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/sales-orders");
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error("❌ Error al obtener ventas:", err);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Notas de Venta</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Total</th>
              <th className="p-2">Tipo Entrega</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Estado de Entrega</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} className="text-center border-b">
                <td className="p-2">{venta.id}</td>
                <td className="p-2">{venta.fecha}</td>
                <td className="p-2">{venta.total} Bs</td>
                <td className="p-2">{venta.tipo_entrega}</td>
                <td className="p-2">{venta.direccion_entrega || "-"}</td>
                <td className="p-2">{venta.estado_entrega || "alistando"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotasVenta;
