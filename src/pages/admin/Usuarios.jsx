import { useEffect, useState } from "react";
import { fetchUsuarios } from "../../services/userService";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    correo: "",
    telephone: "",
    password: "",
    rol_id: 3,
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const data = await fetchUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };

    obtenerUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    const confirmar = confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://54.235.59.253/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("✅ Usuario eliminado");
        const dataActualizada = await fetchUsuarios();
        setUsuarios(dataActualizada);
      } else {
        const error = await res.json();
        alert(error?.error || "❌ Error al eliminar");
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("❌ Error de conexión");
    }
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://54.235.59.253/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario creado correctamente");
        setMostrarFormulario(false);
        setNuevoUsuario({ username: "", correo: "", telephone: "", password: "", rol_id: 3 });
        const actualizados = await fetchUsuarios();
        setUsuarios(actualizados);
      } else {
        alert(data.error || "❌ Error al crear");
      }
    } catch (err) {
      console.error("Error al crear usuario:", err);
      alert("❌ Error de conexión");
    }
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://54.235.59.253/api/users/${usuarioEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioEditando),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario actualizado correctamente");
        setUsuarioEditando(null);
        const actualizados = await fetchUsuarios();
        setUsuarios(actualizados);
      } else {
        alert(data.error || "❌ Error al actualizar");
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("❌ Error de conexión");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Gestión de Usuarios</h1>

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
      >
        {mostrarFormulario ? "Cancelar" : "Crear Usuario"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={crearUsuario} className="mb-6 space-y-4 bg-white p-4 border rounded">
          <input
            type="text"
            placeholder="Usuario"
            value={nuevoUsuario.username}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={nuevoUsuario.correo}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={nuevoUsuario.telephone}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telephone: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <select
            value={nuevoUsuario.rol_id}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol_id: parseInt(e.target.value) })}
            className="border px-2 py-1 w-full"
          >
            <option value={1}>Admin</option>
            <option value={2}>Empleado</option>
            <option value={3}>Cliente</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Registrar
          </button>
        </form>
      )}

      {usuarioEditando && (
        <form onSubmit={actualizarUsuario} className="mb-6 space-y-4 bg-white p-4 border rounded">
          <h3 className="font-bold text-lg mb-2">Editar Usuario</h3>
          <input
            type="text"
            value={usuarioEditando.username}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, username: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <input
            type="email"
            value={usuarioEditando.correo}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, correo: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <input
            type="tel"
            value={usuarioEditando.telephone}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, telephone: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setUsuarioEditando(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-red-300">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="text-center border-b">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.correo}</td>
                <td className="p-2">{user.telephone}</td>
                <td className="p-2">
                  {user.rol_id === 1 ? "Admin" : user.rol_id === 2 ? "Empleado" : "Cliente"}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setUsuarioEditando(user)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(user.id)}
                    className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700"
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

export default Usuarios;
