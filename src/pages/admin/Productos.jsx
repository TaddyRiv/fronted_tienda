import { useEffect, useState } from "react";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    imagen: "",
  });

  const fetchProductos = async () => {
    const res = await fetch("http://54.235.59.253/api/products");
    const data = await res.json();
    setProductos(data);
  };

  const fetchCategorias = async () => {
    const res = await fetch("http://54.235.59.253/api/categories");
    const data = await res.json();
    setCategorias(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://54.235.59.253/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Producto registrado");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        imagen: "",
      });
      fetchProductos();
    } else {
      alert(data.error || "❌ Error al crear producto");
    }
  };

  // ✅ FUNCIÓN ELIMINAR
  const eliminarProducto = async (id) => {
    const confirmar = confirm("¿Estás seguro que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://54.235.59.253/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("🗑️ Producto eliminado correctamente");
        fetchProductos(); // recargar lista
      } else {
        alert(data.error || "❌ Error al eliminar producto");
      }
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("❌ Error de conexión");
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Productos</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-8">
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border-b-2 border-red-500 p-2"
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border-b-2 border-red-500 p-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border-b-2 border-red-500 p-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="w-full border-b-2 border-red-500 p-2"
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full border-b-2 border-red-500 p-2"
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="URL de imagen"
          value={form.imagen}
          onChange={(e) => setForm({ ...form, imagen: e.target.value })}
          className="w-full border-b-2 border-red-500 p-2"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Crear producto
        </button>
      </form>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2">Imagen</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Categoría ID</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id} className="text-center border-b">
                <td className="p-2">
                  <img
                    src={prod.imagen || "https://via.placeholder.com/80x50.png?text=Sin+imagen"}
                    alt={prod.name}
                    className="w-20 h-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2">{prod.name}</td>
                <td className="p-2">{prod.description}</td>
                <td className="p-2">{prod.price} Bs</td>
                <td className="p-2">{prod.stock}</td>
                <td className="p-2">{prod.category_id}</td>
                <td className="p-2">
                  <button
                    onClick={() => eliminarProducto(prod.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
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

export default Productos;
