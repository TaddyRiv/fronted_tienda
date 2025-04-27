import React, { useState, useEffect } from "react";

const EstadoPedido = ({ orderId }) => {
  const [pedido, setPedido] = useState(null);

  // Obtener el estado del pedido desde el backend
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/sales-orders/${orderId}`);
        const data = await response.json();
        setPedido(data);
      } catch (error) {
        console.error("Error al obtener el estado del pedido", error);
      }
    };

    fetchPedido();
  }, [orderId]); // El hook se ejecutará cuando se cambie el orderId

  return (
    <div>
      {pedido ? (
        <div>
          <h2>Estado de tu Pedido</h2>
          <p><strong>Estado:</strong> {pedido.estado_entrega}</p>
          <p><strong>Tipo de Entrega:</strong> {pedido.tipo_entrega}</p>
          <p><strong>Dirección de Entrega:</strong> {pedido.direccion_entrega || "No aplica"}</p>
        </div>
      ) : (
        <p>Cargando estado del pedido...</p>
      )}
    </div>
  );
};

export default EstadoPedido;
