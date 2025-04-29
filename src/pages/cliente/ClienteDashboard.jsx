import { useContext, useEffect, useState } from "react";
import WidgetCard from "../../components/WidgetCard";
import NavbarCliente from "../../components/NavbarCliente";
import ProductoCard from "../../components/ProductoCard";
import { CarritoContext } from "../../context/CarritoContext";
import ReconocimientoVoz from "../../components/ReconocimientoVoz"; // ✅ Importado

const ClienteDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [misPedidos, setMisPedidos] = useState([]);
  const [ultimaCompra, setUltimaCompra] = useState(null);
  const { agregarProducto } = useContext(CarritoContext);

  // Obtener productos
  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProductos(data);
    };
    fetchProductos();
  }, []);

  // Obtener pedidos
  useEffect(() => {
    const fetchPedidos = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      if (!userId) return;

      const res = await fetch(`http://localhost:5000/api/sales-orders?user_id=${userId}`);
      const data = await res.json();
      setMisPedidos(data);

      const lastPurchase = data?.[0] ?? null;
      setUltimaCompra(lastPurchase ? lastPurchase.fecha : "N/A");
    };
    fetchPedidos();
  }, []);

  return (
    <>
      <NavbarCliente />
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-red-700 mb-8">Panel del Cliente</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <WidgetCard titulo="Mis pedidos" valor={misPedidos.length} />
          <WidgetCard titulo="Última compra" valor={ultimaCompra || "N/A"} />
        </div>

        {/* ✅ Comando por voz (básico, sin API) */}
        <ReconocimientoVoz productos={productos} />

        <h2 className="text-2xl font-bold text-red-600 mb-4">Catálogo de productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((prod) => (
            <ProductoCard key={prod.id} producto={prod} />
          ))}
        </div>

        <h2 className="text-2xl font-bold text-red-600 mt-10 mb-4">Mis Pedidos</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-red-300">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Total</th>
                <th className="p-2">Estado de Entrega</th>
              </tr>
            </thead>
            <tbody>
              {misPedidos.map((pedido) => (
                <tr key={pedido.id} className="text-center border-b">
                  <td className="p-2">{pedido.id}</td>
                  <td className="p-2">{pedido.fecha}</td>
                  <td className="p-2">{pedido.total} Bs</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        pedido.estado_entrega === "alistando"
                          ? "bg-yellow-500"
                          : pedido.estado_entrega === "en camino"
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                    >
                      {pedido.estado_entrega}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ClienteDashboard;
