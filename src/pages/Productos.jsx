import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { getCategorias } from '../lib/categoriesService.js';

export const Productos = () => {
  const { categoriaId, subcategoriaId } = useParams();
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: categoriaId || '',
    subcategoria: subcategoriaId || '',
    minPrecio: 0,
    maxPrecio: 100000,
    ordenar: 'relevancia'
  });

  // Actualizar filtros cuando cambian los parámetros de URL
  useEffect(() => {
    setFiltros(prev => ({
      ...prev,
      categoria: categoriaId || '',
      subcategoria: subcategoriaId || ''
    }));
  }, [categoriaId, subcategoriaId]);

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const cats = await getCategorias();
        setCategorias(cats);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };
    loadCategorias();
  }, []);

  // Cargar productos con filtros
  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoading(true);
        const productosRef = collection(db, 'productos');
        let constraints = [];

        if (filtros.categoria) {
          constraints.push(where('categoria', '==', filtros.categoria));
        }
        if (filtros.subcategoria) {
          constraints.push(where('subcategoria', '==', filtros.subcategoria));
        }

        const q = query(productosRef, ...constraints);
        const querySnapshot = await getDocs(q);
        
        let productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filtrar por precio
        productosData = productosData.filter(p => 
          p.precio >= filtros.minPrecio && p.precio <= filtros.maxPrecio
        );

        // Ordenar
        switch (filtros.ordenar) {
          case 'menor-precio':
            productosData.sort((a, b) => a.precio - b.precio);
            break;
          case 'mayor-precio':
            productosData.sort((a, b) => b.precio - a.precio);
            break;
          case 'nombre':
            productosData.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
          case 'relevancia':
          default:
            // Mantener orden de Firestore
            break;
        }

        setProductos(productosData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setLoading(false);
      }
    };

    loadProductos();
  }, [filtros]);

  const handleCategoriaChange = (catId) => {
    setFiltros(prev => ({ ...prev, categoria: catId, subcategoria: '' }));
    navigate(`/productos/${catId}`);
  };

  const handleSubcategoriaChange = (subcatId) => {
    setFiltros(prev => ({ ...prev, subcategoria: subcatId }));
    navigate(`/productos/${filtros.categoria}/${subcatId}`);
  };

  const categoriaActual = categorias.find(c => c.id === filtros.categoria);
  const subcategorias = categoriaActual?.subcategories || [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Título y breadcrumb */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Nuestros Productos</h1>
            {categoriaActual && (
              <p className="text-gray-600 mt-2">
                <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate('/productos')}>
                  Productos
                </span>
                {' > '}
                <span className="font-semibold">{categoriaActual.name}</span>
                {filtros.subcategoria && (
                  <>
                    {' > '}
                    <span className="font-semibold">
                      {subcategorias.find(s => s.id === filtros.subcategoria)?.name}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filtros */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Filtro</h2>

                {/* Categorías */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setFiltros(prev => ({ ...prev, categoria: '', subcategoria: '' }));
                        navigate('/productos');
                      }}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        !filtros.categoria 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Todas
                    </button>
                    {categorias.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoriaChange(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded transition text-sm ${
                          filtros.categoria === cat.id 
                            ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategorías */}
                {subcategorias.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Subcategorías</h3>
                    <div className="space-y-2">
                      {subcategorias.map(subcat => (
                        <label key={subcat.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filtros.subcategoria === subcat.id}
                            onChange={() => handleSubcategoriaChange(
                              filtros.subcategoria === subcat.id ? '' : subcat.id
                            )}
                            className="rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{subcat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rango de Precio */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Precio</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Mínimo: ${filtros.minPrecio.toLocaleString('es-CL')}</label>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filtros.minPrecio}
                        onChange={(e) => setFiltros(prev => ({ 
                          ...prev, 
                          minPrecio: parseInt(e.target.value) 
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Máximo: ${filtros.maxPrecio.toLocaleString('es-CL')}</label>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filtros.maxPrecio}
                        onChange={(e) => setFiltros(prev => ({ 
                          ...prev, 
                          maxPrecio: parseInt(e.target.value) 
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Ordenar */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ordenar por</h3>
                  <select
                    value={filtros.ordenar}
                    onChange={(e) => setFiltros(prev => ({ ...prev, ordenar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="menor-precio">Menor Precio</option>
                    <option value="mayor-precio">Mayor Precio</option>
                    <option value="nombre">Nombre (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                  </div>
                </div>
              ) : productos.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="text-gray-500 text-lg">No hay productos que coincidan con tus filtros</p>
                  <button
                    onClick={() => {
                      setFiltros({ categoria: '', subcategoria: '', minPrecio: 0, maxPrecio: 100000, ordenar: 'relevancia' });
                      navigate('/productos');
                    }}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg">
                    <p className="text-gray-600">Mostrando {productos.length} producto(s)</p>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                        </svg>
                      </button>
                      <button className="p-2 text-indigo-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v4a1 1 0 11-2 0V5H7v4a1 1 0 11-2 0V3zM5 11a1 1 0 011 1v1h8v-1a1 1 0 112 0v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1a1 1 0 011-1z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productos.map(producto => (
                      <div key={producto.id} className="group relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                        {/* Imagen */}
                        <div className="relative overflow-hidden bg-gray-200 h-64">
                          {producto.imagen ? (
                            <img
                              src={producto.imagen}
                              alt={producto.nombre}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-400">
                              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                              </svg>
                            </div>
                          )}
                          {/* Badge de descuento (opcional) */}
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Nuevo
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {categoriaActual?.name}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {producto.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {producto.descripcion}
                          </p>

                          {/* Precio y Stock */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                ${producto.precio.toLocaleString('es-CL')}
                              </p>
                              <p className={`text-sm ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {producto.stock > 0 ? `${producto.stock} en stock` : 'Sin stock'}
                              </p>
                            </div>
                          </div>

                          {/* Botón para ir al detalle del producto */}
                          <button
                            onClick={() => navigate(`/producto/${producto.id}`)}
                            className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                          >
                            Ver Detalle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Productos;
