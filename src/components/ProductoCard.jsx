import { useContext, useState } from "react";  // Asegúrate de importar useContext
import { CarritoContext } from "../context/CarritoContext";  // Contexto del carrito
import sinImagen from "../assets/sin-imagen.png";  // Imagen por defecto

const ProductoCard = ({ producto }) => {
  const { agregarProducto } = useContext(CarritoContext);  // Obtener la función de agregar al carrito desde el contexto
  const [mensajeError, setMensajeError] = useState("");  // Mensaje de error
  const [mensajeExito, setMensajeExito] = useState("");  // Mensaje de éxito

  // Función para agregar al carrito
  const agregarAlCarrito = async () => {
    // Verificar stock antes de agregar al carrito
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/products/${producto.id}/check-stock`);
      const data = await res.json();
  
      if (res.ok) {
        if (data.stock_disponible > 0) {
          // Si hay stock suficiente, agregar el producto al carrito
          agregarProducto(producto);
          setMensajeExito(`Producto ${producto.name} añadido al carrito.`);
          setMensajeError(""); // Limpiar mensaje de error
        } else {
          setMensajeError(`No hay suficiente stock de ${producto.name}.`);
          setMensajeExito(""); // Limpiar mensaje de éxito
        }
      } else {
        setMensajeError(data?.error || "❌ Error al verificar stock.");
        setMensajeExito(""); // Limpiar mensaje de éxito
      }
    } catch (error) {
      setMensajeError("❌ Error al conectar con el servidor.");
      setMensajeExito(""); // Limpiar mensaje de éxito
    }
  };

  return (
    <div className="bg-white border shadow rounded p-4 flex flex-col">
      <img
        src={producto.imagen || sinImagen}
        alt={producto.name}
        onError={(e) => { e.target.src = sinImagen; }}  // Si la imagen falla, mostrar imagen por defecto
        className="w-full h-40 object-cover mb-4 rounded"
      />
      <h2 className="text-xl font-bold text-red-700">{producto.name}</h2>
      <p className="text-gray-600 mb-2">{producto.description}</p>
      <p className="text-lg font-semibold text-black mb-4">{producto.price} Bs</p>

      {/* Mostrar mensajes de error o éxito */}
      {mensajeExito && <p className="text-green-600">{mensajeExito}</p>}
      {mensajeError && <p className="text-red-600">{mensajeError}</p>}

      <button
        onClick={agregarAlCarrito}
        className="bg-red-600 text-white py-1 rounded hover:bg-red-700"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductoCard;
