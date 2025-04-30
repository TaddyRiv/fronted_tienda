import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CrearOrdenInterna = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [buscarUsuario, setBuscarUsuario] = useState("");
  const [tipoPago, setTipoPago] = useState("efectivo");

  const [sucursalId, setSucursalId] = useState(1); // Fijo o puedes hacerlo dinámico

  useEffect(() => {
    fetch("http://54.235.59.253/api/products")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos:", err));

    fetch("http://54.235.59.253/api/users")
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("Error al cargar usuarios:", err));
  }, []);

  const agregarProducto = (producto) => {
    const yaExiste = carrito.find(p => p.id === producto.id);
    if (yaExiste) {
      setCarrito(carrito.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + item.price * item.cantidad, 0);
  };

  const crearOrdenCompleta = async () => {
    if (!usuarioSeleccionado) {
      Swal.fire("❗ Atención", "Debes seleccionar un usuario.", "warning");
      return;
    }

    if (carrito.length === 0) {
      Swal.fire("🛒 Carrito vacío", "Agrega productos antes de finalizar.", "warning");
      return;
    }

    try {
      // 1. Verificar stock antes
      for (const item of carrito) {
        const res = await fetch(`http://54.235.59.253/api/products/${item.id}/check-stock`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(`Error verificando stock de ${item.name}`);
        }

        if (data.stock_disponible < item.cantidad) {
          Swal.fire("⚠️ Stock insuficiente", `Producto "${item.name}" disponible: ${data.stock_disponible}`, "error");
          return;
        }
      }

      // 2. Crear orden general
      const ordenRes = await fetch("http://54.235.59.253/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: "pendiente",
          monto: 0,
          sucursal_id: sucursalId,
        }),
      });

      const orden = await ordenRes.json();
      const orderId = orden.id;

      // 3. Agregar detalles y descontar stock
      for (const item of carrito) {
        await fetch("http://54.235.59.253/api/order-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cantidad: item.cantidad,
            monto: item.price * item.cantidad,
            order_id: orderId,
            product_id: item.id
          }),
        });

        await fetch(`http://54.235.59.253/api/products/${item.id}/update-stock`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cantidad: item.cantidad }),
        });
      }

      // 4. Crear nota de venta
      await fetch("http://54.235.59.253/api/sales-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuarioSeleccionado.id,
          total: calcularTotal(),
          tipo_entrega: "interno",
          direccion_entrega: "",
          estado_entrega: "alistando"
        }),
      });

      Swal.fire("✅ ¡Orden creada!", "La orden y nota de venta fueron generadas exitosamente.", "success");

      // Limpiar después de éxito
      setCarrito([]);
      setUsuarioSeleccionado(null);
      setBuscarUsuario("");
      setTipoPago("efectivo");

    } catch (err) {
      console.error("❌ Error en la creación de orden:", err);
      Swal.fire("❌ Error", "Ocurrió un problema al crear la orden.", "error");
    }
  };

  const usuariosFiltrados = usuarios.filter(user =>
    user.username.toLowerCase().includes(buscarUsuario.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-700">Crear Orden Interna</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección Productos */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">📦 Productos</h3>

          <div className="h-[400px] overflow-y-auto border rounded-lg shadow p-4 bg-white">
            <table className="w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="py-2">Producto</th>
                  <th className="py-2">Precio</th>
                  <th className="py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.id} className="border-b text-center">
                    <td className="py-2">{prod.name}</td>
                    <td className="py-2">{prod.price} Bs</td>
                    <td className="py-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => agregarProducto(prod)}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección Usuario + Carrito */}
        <div>
          {/* Buscar usuario */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">👤 Seleccionar Usuario</h3>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full p-2 border rounded mb-2"
              value={buscarUsuario}
              onChange={(e) => setBuscarUsuario(e.target.value)}
            />
            <div className="h-[150px] overflow-y-auto border rounded p-2 bg-white">
              {usuariosFiltrados.map(user => (
                <div
                  key={user.id}
                  className={`p-2 cursor-pointer hover:bg-red-100 rounded ${usuarioSeleccionado?.id === user.id ? 'bg-red-200' : ''}`}
                  onClick={() => setUsuarioSeleccionado(user)}
                >
                  {user.username}
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de pago */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">💵 Tipo de Pago</h3>
            <select
              className="w-full p-2 border rounded"
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          {/* Carrito */}
          <div className="border rounded-lg shadow p-4 bg-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">🛒 Carrito</h3>

            {carrito.length === 0 ? (
              <p className="text-gray-500">Sin productos</p>
            ) : (
              <table className="w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="py-2">Producto</th>
                    <th className="py-2">Precio</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => (
                    <tr key={item.id} className="border-b text-center">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.price} Bs</td>
                      <td className="py-2">{item.cantidad}</td>
                      <td className="py-2">{item.price * item.cantidad} Bs</td>
                      <td className="py-2">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => quitarProducto(item.id)}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <p className="mt-4 text-lg font-bold">
              Total: <span className="text-red-700">{calcularTotal()} Bs</span>
            </p>

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
                onClick={() => setCarrito([])}
              >
                Vaciar carrito
              </button>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                onClick={crearOrdenCompleta}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearOrdenInterna;
