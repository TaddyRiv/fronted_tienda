import { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";

const ReconocimientoVoz = ({ productos }) => {
  const { agregarProducto } = useContext(CarritoContext);
  const [mensaje, setMensaje] = useState("");

  const reconocerVoz = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.start();

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript.toLowerCase();
      console.log("🎙️ Comando de voz:", texto);
      procesarComando(texto);
    };

    recognition.onerror = (e) => {
      console.error("❌ Error de voz:", e);
    };
  };

  const procesarComando = (texto) => {
    const comandos = ["agrega", "agregar", "añade", "añadir", "pon", "poner"];
    const palabraClave = comandos.find((cmd) => texto.includes(cmd));
  
    if (!palabraClave || !texto.includes("producto")) {
      setMensaje("❌ Comando no reconocido. Diga algo como 'agrega producto iphone 12'");
      return;
    }
  
    // Elimina las palabras clave y extrae solo el nombre
    let nombre = texto;
    comandos.forEach((cmd) => {
      nombre = nombre.replace(cmd, "");
    });
    nombre = nombre.replace("producto", "").replace("al carrito", "").trim();
  
    // Buscar producto por nombre
    const producto = productos.find((p) =>
      p.name.toLowerCase().includes(nombre)
    );
  
    if (!producto) {
      setMensaje(`❌ No se encontró el producto "${nombre}"`);
      return;
    }
  
    if (producto.stock <= 0) {
      setMensaje(`❌ No hay stock de "${producto.name}".`);
      return;
    }
  
    agregarProducto(producto);
    setMensaje(`✅ "${producto.name}" agregado al carrito.`);
  };
  

  return (
    <div className="mb-4">
      <button
        onClick={reconocerVoz}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🎤 Activar comando por voz
      </button>
      {mensaje && <p className="mt-2 text-sm text-gray-800">{mensaje}</p>}
    </div>
  );
};

export default ReconocimientoVoz;
