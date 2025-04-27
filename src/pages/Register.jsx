import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    correo: "",
    telephone: "",
    password: "",
    confirmar: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmar) {
      alert("❗ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          correo: formData.correo,
          telephone: formData.telephone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registro exitoso");
        navigate("/login");
      } else {
        alert(data.error || "❌ Error en el registro");
      }
    } catch (error) {
      console.error("❌ Error al conectar con backend:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white border-t-4 border-red-600 shadow-lg p-10 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          Registro de Usuario
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border-b-2 border-red-500"
            />
          </div>
          <div>
            <label className="block mb-1">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full p-2 border-b-2 border-red-500"
            />
          </div>
          <div>
            <label className="block mb-1">Teléfono</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              className="w-full p-2 border-b-2 border-red-500"
            />
          </div>
          <div>
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border-b-2 border-red-500"
            />
          </div>
          <div>
            <label className="block mb-1">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmar"
              value={formData.confirmar}
              onChange={handleChange}
              required
              className="w-full p-2 border-b-2 border-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
