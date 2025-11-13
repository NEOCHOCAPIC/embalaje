import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductoById } from '../lib/productsService';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await getProductoById(productoId);
        setProducto(data);
      } catch (error) {
        console.error('Error cargando producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [productoId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Cargando...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!producto) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600">Producto no encontrado</p>
        </div>
        <Footer />
      </>
    );
  }

  const whatsappUrl = `https://wa.me/56973157810?text=¡Hola! Me interesa el producto ${producto.nombre}. Puedes verlo aquí: ${window.location.href}`;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="bg-white p-6 rounded-lg shadow">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Detalles del producto */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>
            <p className="text-lg text-gray-700 mb-4">{producto.descripcion}</p>
            <p className="text-2xl font-bold text-indigo-600 mb-4">
              ${producto.precio.toLocaleString('es-CL')}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductoDetalle;