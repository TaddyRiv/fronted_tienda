export const obtenerRecomendacion = async (producto_id) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/recomendar-productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ producto_id }),
      });
  
      const data = await res.json();
      return data.recomendacion || "";
    } catch (err) {
      console.error("❌ Error obteniendo recomendación:", err);
      return "";
    }
  };
  