import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductoById } from '../lib/productsService';
import { getActiveOffers, getProductOffer } from '../lib/ofertasService';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

const ProductoDetalle = () => {
  const { productoId } = useParams();
  const [producto, setProducto] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productoData, ofertasData] = await Promise.all([
          getProductoById(productoId),
          getActiveOffers()
        ]);
        setProducto(productoData);
        setOfertas(ofertasData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Funciones para manejar ofertas
  const calcularPrecioConDescuento = (precio, descuentoPorcentaje) => {
    return precio * (1 - descuentoPorcentaje / 100);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const oferta = getProductOffer(producto, ofertas);
  const precioFinal = oferta ? calcularPrecioConDescuento(producto.precio, oferta.descuentoPorcentaje) : producto.precio;

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
            <p className="text-lg text-gray-700 mb-6">{producto.descripcion}</p>
            
            {/* Sección de precio */}
            <div className="mb-6">
              {oferta ? (
                <div>
                  {/* Badge de oferta */}
                  <div className="mb-3">
                    <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      🏷️ {oferta.descuentoPorcentaje}% OFF - {oferta.nombre}
                    </span>
                  </div>
                  
                  {/* Precio original tachado */}
                  <p className="text-lg text-gray-500 line-through mb-1">
                    Precio normal: {formatearPrecio(producto.precio)}
                  </p>
                  
                  {/* Precio con descuento */}
                  <p className="text-3xl font-bold text-red-600 mb-2">
                    {formatearPrecio(precioFinal)}
                  </p>
                  
                  {/* Ahorro */}
                  <p className="text-lg font-medium text-green-600 mb-2">
                    ¡Ahorras {formatearPrecio(producto.precio - precioFinal)}!
                  </p>
                  
                  {/* Vigencia de la oferta */}
                  {oferta.fechaFin && (
                    <p className="text-sm text-gray-600">
                      ⏰ Oferta válida hasta el {oferta.fechaFin.toLocaleDateString('es-CL')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-3xl font-bold text-indigo-600">
                  {formatearPrecio(producto.precio)}
                </p>
              )}
            </div>
            
            {/* Stock */}
            <div className="mb-6">
              <p className={`text-lg font-medium ${
                producto.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {producto.stock > 0 
                  ? `✓ En stock (${producto.stock} unidades disponibles)`
                  : '⚠️ Sin stock'
                }
              </p>
            </div>
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