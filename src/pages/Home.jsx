import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import Navbar from "../components/Navbar"; // si usás otro navbar aquí
import sinImagen from "../assets/sin-imagen.png";

const Home = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => res.json())
      .then(setProductos);
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Productos destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.slice(0, 6).map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
