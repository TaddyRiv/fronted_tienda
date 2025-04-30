import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";

const PaymentForm = ({ amount, onPagoExitoso }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const crearIntentoPago = async () => {
      try {
        const res = await fetch('http://54.235.59.253/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amount * 100 }), // Stripe espera en centavos
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("❌ Error obteniendo clientSecret:", data.error);
        }
      } catch (error) {
        console.error("❌ Error creando PaymentIntent:", error);
      }
    };

    if (amount) {
      crearIntentoPago();
    }
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements || !clientSecret) {
      alert("Stripe aún no está listo.");
      return;
    }
  
    setLoading(true);
  
    const cardElement = elements.getElement(CardElement);
  
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
  
    setLoading(false);
  
    if (error) {
      console.error("❌ Error al confirmar pago:", error.message);
      alert("Error al procesar el pago: " + error.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("✅ Pago realizado con éxito");
      onPagoExitoso?.();
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button
        type="submit"
        disabled={!stripe || !clientSecret || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Procesando..." : "Confirmar Pago"}
      </button>
    </form>
  );
};

export default PaymentForm;
