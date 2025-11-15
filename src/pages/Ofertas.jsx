import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import WhatsAppButton from '../components/Wsp';

export const OfertasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ofertasConProductos, setOfertasConProductos] = useState([]);

  useEffect(() => {
    const loadOfertas = async () => {
      try {
        // Cargar ofertas activas
        const now = new Date();
        
        const ofertasQuery = query(
          collection(db, 'ofertas'),
          where('activa', '==', true)
        );
        const ofertasSnapshot = await getDocs(ofertasQuery);
        
        const ofertasData = ofertasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaInicio: doc.data().fechaInicio?.toDate(),
          fechaFin: doc.data().fechaFin?.toDate(),
        }));
        

        // Filtrar ofertas por fecha
        const ofertasVigentes = ofertasData.filter(oferta => {
          const inicio = oferta.fechaInicio;
          const fin = oferta.fechaFin;

          
          if (!inicio) return false;
          if (inicio > now) return false;
          if (fin && fin < now) return false;
          return true;
        });
        
        console.log('✅ Ofertas vigentes:', ofertasVigentes);

        // Cargar productos
        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosData = productosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Cargar categorías
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCategorias(categoriasData);

        // Procesar ofertas con productos
        const ofertasConProductosData = [];
        
        for (const oferta of ofertasVigentes) {
          if (oferta.tipoOferta === 'producto') {
            // Manejar múltiples productos o producto único (compatibilidad)
            const productosIds = oferta.productosIds || (oferta.productoId ? [oferta.productoId] : []);
            
            const productosEncontrados = productosData.filter(p => productosIds.includes(p.id));
            
            if (productosEncontrados.length > 0) {
              ofertasConProductosData.push({
                ...oferta,
                productos: productosEncontrados
              });
            }
          } else if (oferta.tipoOferta === 'categoria') {
            const productosCategoria = productosData.filter(p => p.categoria === oferta.categoriaId);
            
            if (productosCategoria.length > 0) {
              ofertasConProductosData.push({
                ...oferta,
                productos: productosCategoria
              });
            }
          } else if (oferta.tipoOferta === 'subcategoria') {
            const productosSubcategoria = productosData.filter(
              p => p.categoria === oferta.categoriaId && p.subcategoria === oferta.subcategoriaId
            );
            
            if (productosSubcategoria.length > 0) {
              ofertasConProductosData.push({
                ...oferta,
                productos: productosSubcategoria
              });
            }
          }
        }

        setOfertasConProductos(ofertasConProductosData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando ofertas:', error);
        setLoading(false);
      }
    };

    loadOfertas();
  }, []);

  const calcularPrecioConDescuento = (precio, descuento) => {
    return precio * (1 - descuento / 100);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getOfferTitle = (oferta) => {
    if (oferta.tipoOferta === 'categoria') {
      const categoria = categorias.find(c => c.id === oferta.categoriaId);
      return `${oferta.descuentoPorcentaje}% OFF en ${categoria?.name || 'Categoría'}`;
    } else if (oferta.tipoOferta === 'subcategoria') {
      const categoria = categorias.find(c => c.id === oferta.categoriaId);
      const subcategoria = categoria?.subcategories?.find(s => s.id === oferta.subcategoriaId);
      return `${oferta.descuentoPorcentaje}% OFF en ${subcategoria?.name || 'Subcategoría'}`;
    } else if (oferta.tipoOferta === 'producto') {
      const productosIds = oferta.productosIds || (oferta.productoId ? [oferta.productoId] : []);
      if (productosIds.length === 1) {
        return `${oferta.descuentoPorcentaje}% OFF - ${oferta.nombre}`;
      } else {
        return `${oferta.descuentoPorcentaje}% OFF en ${productosIds.length} productos - ${oferta.nombre}`;
      }
    }
    return `${oferta.descuentoPorcentaje}% OFF - ${oferta.nombre}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando ofertas...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-red-50">
        {/* Hero Section */}
        <div className="bg-red-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🔥 Ofertas Especiales
            </h1>
            <p className="text-xl text-red-100 mb-6">
              Aprovecha estos descuentos exclusivos por tiempo limitado
            </p>
            <div className="text-lg text-red-100">
              {ofertasConProductos.length} {ofertasConProductos.length === 1 ? 'oferta disponible' : 'ofertas disponibles'}
            </div>
          </div>
        </div>

        {/* Ofertas Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {ofertasConProductos.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🏷️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No hay ofertas disponibles en este momento
                </h2>
                <p className="text-gray-600 mb-8">
                  Vuelve pronto para ver nuestras próximas promociones
                </p>
                <Link
                  to="/productos"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg"
                >
                  Ver todos los productos
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {ofertasConProductos.map((oferta) => (
                  <div key={oferta.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-200">
                    {/* Header de la oferta */}
                    <div className="bg-red-600 px-6 py-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">
                            {getOfferTitle(oferta)}
                          </h3>
                          {oferta.descripcion && (
                            <p className="text-red-100 text-lg">
                              {oferta.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                            <div className="text-black font-medium">
                              {oferta.fechaFin ? (
                                <>
                                  ⏰ Válida hasta el {oferta.fechaFin.toLocaleDateString('es-CL')}
                                </>
                              ) : (
                                '🎯 Oferta por tiempo limitado'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Productos de la oferta */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {oferta.productos.slice(0, 8).map((producto) => {
                          const precioOriginal = producto.precio;
                          const precioConDescuento = calcularPrecioConDescuento(precioOriginal, oferta.descuentoPorcentaje);
                          const ahorro = precioOriginal - precioConDescuento;

                          return (
                            <Link
                              key={producto.id}
                              to={`/producto/${producto.id}`}
                              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              {/* Badge de descuento */}
                              <div className="relative">
                                <div className="absolute top-3 left-3 z-10">
                                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    -{oferta.descuentoPorcentaje}%
                                  </span>
                                </div>
                                {producto.imagen ? (
                                  <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-4xl">📦</span>
                                  </div>
                                )}
                              </div>

                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {producto.nombre}
                                </h4>
                                
                                {producto.descripcion && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {producto.descripcion}
                                  </p>
                                )}

                                <div className="space-y-2">
                                  {/* Precio original tachado */}
                                  <div className="text-sm text-gray-500 line-through">
                                    Precio normal: {formatearPrecio(precioOriginal)}
                                  </div>
                                  
                                  {/* Precio con descuento */}
                                  <div className="text-xl font-bold text-red-600">
                                    {formatearPrecio(precioConDescuento)}
                                  </div>
                                  
                                  {/* Ahorro */}
                                  <div className="text-sm font-medium text-green-600">
                                    ¡Ahorras {formatearPrecio(ahorro)}!
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <span className="inline-block bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg group-hover:bg-red-700 transition-colors">
                                    Ver Producto →
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Mostrar más productos si hay más de 8 */}
                      {oferta.productos.length > 8 && (
                        <div className="mt-6 text-center">
                          <Link
                            to={oferta.tipoOferta === 'categoria' 
                              ? `/productos/${oferta.categoriaId}` 
                              : `/productos/${oferta.categoriaId}/${oferta.subcategoriaId}`
                            }
                            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg"
                          >
                            Ver todos los {oferta.productos.length} productos en oferta
                            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      )}

                      {/* Mostrar enlace para categoría/subcategoría incluso con menos de 8 productos */}
                      {(oferta.tipoOferta === 'categoria' || oferta.tipoOferta === 'subcategoria') && oferta.productos.length <= 8 && (
                        <div className="mt-6 text-center">
                          <Link
                            to={oferta.tipoOferta === 'categoria' 
                              ? `/productos/${oferta.categoriaId}` 
                              : `/productos/${oferta.categoriaId}/${oferta.subcategoriaId}`
                            }
                            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg"
                          >
                            Explorar toda la sección en oferta
                            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿No encontraste lo que buscabas?
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora nuestro catálogo completo o contáctanos para ofertas personalizadas
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/productos"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Ver todos los productos
                  </Link>
                  <Link
                    to="/contacto"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Contactar para ofertas especiales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </>
  );
};