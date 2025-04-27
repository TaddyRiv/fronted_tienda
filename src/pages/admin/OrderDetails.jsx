import { useEffect, useState } from "react";

const OrderDetails = () => {
  const [detalles, setDetalles] = useState([]);

  const fetchDetalles = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/order-details");
      const data = await res.json();
      setDetalles(data);
    } catch (err) {
      console.error("❌ Error al obtener detalles de orden:", err);
    }
  };

  useEffect(() => {
    fetchDetalles();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Detalles de Órdenes</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Monto (Bs)</th>
              <th className="p-2">ID Orden</th>
              <th className="p-2">ID Producto</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id} className="text-center border-b">
                <td className="p-2">{d.id}</td>
                <td className="p-2">{d.cantidad}</td>
                <td className="p-2">{d.monto}</td>
                <td className="p-2">{d.order_id}</td>
                <td className="p-2">{d.product_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
