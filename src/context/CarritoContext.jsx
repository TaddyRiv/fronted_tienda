import { createContext, useState, useEffect, useContext } from "react";

// Crear contexto
export const CarritoContext = createContext();

// Proveedor del carrito
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const localData = localStorage.getItem("carrito");
    return localData ? JSON.parse(localData) : [];
  });

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Agregar producto al carrito
  const agregarProducto = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Quitar producto por ID
  const quitarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, quitarProducto, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// Hook personalizado para consumir el carrito fácilmente
export const useCarrito = () => useContext(CarritoContext);
