import { useEffect, useState } from "react";
import { useCarrito } from "../../context/CarritoContext";
import sinImagen from "../../assets/sin-imagen.png";

const CatalogoCliente = () => {
  const [productos, setProductos] = useState([]);
  const { añadirProducto } = useCarrito();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Catálogo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="bg-white shadow rounded p-4">
            <img
              src={producto.imagen || sinImagen}
              alt={producto.name}
              onError={(e) => (e.target.src = sinImagen)}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="text-xl font-bold text-red-700">{producto.name}</h2>
            <p className="text-gray-600 text-sm">{producto.description}</p>
            <p className="font-bold text-black">{producto.price} Bs</p>
            <button
              onClick={() => añadirProducto(producto)}
              className="mt-2 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoCliente;
