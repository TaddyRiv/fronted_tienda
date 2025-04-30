import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe("pk_test_51RILgc4ZZSm3Xc4bxDWuGL5h31sKB7q01f5rdSFmwIUUmtIEP2tdX7QumnNZlbUz03nGbHkyb2bpsBfwTIBBdYZE008E0QDlaD");

const PaymentForm = ({ onPagoExitoso }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      alert("Stripe no está listo");
      return;
    }

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://54.235.59.253/pago-exitoso", // ⚡ asegurate que esta ruta existe
      },
      redirect: "if_required",
    });

    setLoading(false);

    if (error) {
      console.error("❌ Error:", error.message);
      alert("Error al procesar el pago: " + error.message);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("✅ Pago realizado");
      onPagoExitoso();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? "Procesando..." : "Confirmar Pago"}
      </button>
    </form>
  );
};

const PasarelaStripe = ({ amount, onPagoExitoso }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!amount || clientSecret) return;

    const fetchClientSecret = async () => {
      try {
        const res = await fetch("http://54.235.59.253/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amount * 100 }),
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creando PaymentIntent:", error);
      }
    };

    fetchClientSecret();
  }, [amount, clientSecret]);

  const options = { clientSecret, appearance: { theme: "stripe" } };

  return (
    <>
      {!clientSecret && <p className="text-gray-500">Cargando pasarela de pago...</p>}
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onPagoExitoso={onPagoExitoso} />
        </Elements>
      )}
    </>
  );
};

export default PasarelaStripe;
