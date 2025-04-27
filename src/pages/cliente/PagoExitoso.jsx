import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PagoExitoso = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Logs para debug opcional
    if (location?.search) {
      console.log("✅ Parámetros devueltos por Stripe:", location.search);
    }

    // ✅ Limpiar carrito del localStorage si se usa
    localStorage.removeItem("cart");

    // ⏳ Redirige al catálogo después de 5 segundos
    const timer = setTimeout(() => {
      navigate("/cliente/catalogo");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 ¡Pago exitoso!</h1>
        <p className="text-gray-700 mb-2">
          Tu pago ha sido procesado correctamente.
        </p>
        <p className="text-sm text-gray-500">
          Serás redirigido al catálogo en unos segundos...
        </p>
      </div>
    </div>
  );
};

export default PagoExitoso;
