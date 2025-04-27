import { useState, useEffect } from "react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/categories");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return alert("El nombre es obligatorio");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Categoría creada");
        setForm({ nombre: "", descripcion: "" });
        fetchCategorias();
      } else {
        alert(data.error || "❌ Error al crear categoría");
      }
    } catch (err) {
      alert("❌ Error de conexión");
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Categorías</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Nombre de categoría"
          className="w-full border-b-2 border-red-500 p-2"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          className="w-full border-b-2 border-red-500 p-2"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Crear categoría
        </button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} className="text-center border-b">
                <td className="p-2">{cat.id}</td>
                <td className="p-2">{cat.nombre}</td>
                <td className="p-2">{cat.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categorias;
