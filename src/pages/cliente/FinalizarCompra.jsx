import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../../context/CarritoContext";
import PaymentForm from "../../components/PaymentForm"; // ✅

const FinalizarCompra = () => {
  const { carrito, vaciarCarrito } = useContext(CarritoContext);
  const navigate = useNavigate();

  const [tipoEnvio, setTipoEnvio] = useState("");
  const [ubicacion, setUbicacion] = useState({ nombre: "", calle: "", zona: "" });
  const [pago, setPago] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const sucursalId = user?.sucursal_id || 1;

  const total = carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  const verificarStockYFinalizarCompra = async () => {
    for (const item of carrito) {
      const res = await fetch(`http://54.235.59.253/api/products/${item.id}/check-stock`);
      const data = await res.json();
      if (data.stock_disponible < item.cantidad) {
        setMensajeError(`No hay suficiente stock para el producto: ${item.name}`);
        return;
      }
    }

    try {
      const orderRes = await fetch("http://54.235.59.253/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "pendiente", monto: total, sucursal_id: sucursalId }),
      });
      const orderData = await orderRes.json();
      const orderId = orderData.id;

      for (const item of carrito) {
        await fetch("http://54.235.59.253/api/order-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cantidad: item.cantidad,
            monto: item.price * item.cantidad,
            order_id: orderId,
            product_id: item.id,
          }),
        });
      }

      const direccion =
        tipoEnvio === "domicilio"
          ? `${ubicacion.nombre} - ${ubicacion.calle} - ${ubicacion.zona || "sin referencia"}`
          : null;

      const ventaRes = await fetch("http://54.235.59.253/api/sales-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cantidad: carrito.length,
          total,
          user_id: userId,
          tipo_entrega: tipoEnvio,
          direccion_entrega: direccion,
        }),
      });

      const ventaData = await ventaRes.json();
      const ventaId = ventaData.id;

      const metodoPagoId = pago === "efectivo" ? 1 : pago === "tarjeta" ? 2 : pago === "qr" ? 3 : null;
      if (!metodoPagoId) {
        alert("Método de pago no válido");
        return;
      }

      await fetch(`http://54.235.59.253/api/sales-orders/${ventaId}/add-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: metodoPagoId }),
      });

      for (const item of carrito) {
        await fetch(`http://54.235.59.253/api/products/${item.id}/update-stock`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cantidad: item.cantidad }),
        });
      }

      vaciarCarrito();
      alert("✅ Compra realizada con éxito");
      navigate("/cliente/catalogo");

    } catch (err) {
      console.error("❌ Error al registrar compra:", err);
      alert("Error al procesar la compra");
    }
  };

  const handleConfirmarCompra = () => {
    if (!tipoEnvio || !pago || (tipoEnvio === "domicilio" && !ubicacion.calle)) {
      alert("Completa todos los campos requeridos");
      return;
    }

    verificarStockYFinalizarCompra();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold text-red-700 mb-6">Finalizar Compra</h2>

      {/* Formulario normal de datos */}
      <div className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Tipo de envío</label>
          <select
            value={tipoEnvio}
            onChange={(e) => setTipoEnvio(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="tienda">📦 Recojo en tienda</option>
            <option value="domicilio">🚚 Envío a domicilio</option>
          </select>
        </div>

        {tipoEnvio === "domicilio" && (
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={ubicacion.nombre}
              onChange={(e) => setUbicacion({ ...ubicacion, nombre: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Calle y número"
              value={ubicacion.calle}
              onChange={(e) => setUbicacion({ ...ubicacion, calle: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Zona o referencia"
              value={ubicacion.zona}
              onChange={(e) => setUbicacion({ ...ubicacion, zona: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-2">Método de pago</label>
          <select
            value={pago}
            onChange={(e) => setPago(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Selecciona un método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="qr">QR</option>
          </select>
        </div>

        {/* Si elige tarjeta, mostramos PaymentForm (que maneja su propio form) */}
        {pago === "tarjeta" && (
          <PaymentForm amount={total} onPagoExitoso={verificarStockYFinalizarCompra} />
        )}

        {/* Si no elige tarjeta, mostrar botón */}
        {pago !== "tarjeta" && (
          <button
            onClick={handleConfirmarCompra}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirmar compra
          </button>
        )}
      </div>

      {mensajeError && (
        <p className="text-red-500 mt-4 font-semibold">{mensajeError}</p>
      )}
    </div>
  );
};

export default FinalizarCompra;
