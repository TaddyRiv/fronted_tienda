import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../../context/CarritoContext";
import NavbarCliente from "../../components/NavbarCliente";
import ProductoCard from "../../components/ProductoCard";

const Carrito = () => {
  const { carrito, quitarProducto, vaciarCarrito } = useContext(CarritoContext);
  const navigate = useNavigate();

  const [productosRecomendados, setProductosRecomendados] = useState([]);

  const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  useEffect(() => {
    if (carrito.length === 0) {
      setProductosRecomendados([]);
      return;
    }

    const ultimo = carrito[carrito.length - 1];
    fetch("http://54.235.59.253/api/recomendar-productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto_id: ultimo.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎯 Recomendaciones recibidas:", data); // 👈 Confirmamos que sí llega
        if (Array.isArray(data)) {
          setProductosRecomendados(data); // 👈 Guardamos todo el array de productos
        }
      })
      .catch((err) => console.error("❌ Error recomendación:", err));
  }, [carrito]);

  return (
    <div className="p-8">
      <NavbarCliente />

      <h1 className="text-3xl text-red-700 font-bold mb-6">🛒 Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <>
          <table className="w-full border border-red-300 mb-6">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-2">Producto</th>
                <th className="p-2">Precio</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id} className="text-center border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.price} Bs</td>
                  <td className="p-2">{item.cantidad}</td>
                  <td className="p-2">{item.price * item.cantidad} Bs</td>
                  <td className="p-2">
                    <button
                      onClick={() => quitarProducto(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xl font-semibold mb-4">
            Total: <span className="text-red-600">{total} Bs</span>
          </p>

          <div className="space-x-4 mb-6">
            <button
              onClick={vaciarCarrito}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Vaciar carrito
            </button>

            <button
              onClick={() => navigate("/cliente/finalizar")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Finalizar compra
            </button>
          </div>

          {/* 🎯 Mostrar productos recomendados */}
          {productosRecomendados.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-red-600 mb-4">
                Productos recomendados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productosRecomendados.map((producto) => (
                  <ProductoCard key={producto.id} producto={producto} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carrito;
