import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export const AdminOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage] = useState(20);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipoOferta: 'producto',
    productosIds: [], 
    categoriaId: '',
    subcategoriaId: '',
    descuentoPorcentaje: '',
    fechaInicio: '',
    fechaFin: '',
    activa: true,
    sinFechaFin: false
  });
  const [productSearchTerm, setProductSearchTerm] = useState(''); // Para búsqueda de productos
  const [showProductSelector, setShowProductSelector] = useState(false); // Para mostrar/ocultar selector
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Cargar datos al inicializar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar ofertas
        const ofertasQuery = query(collection(db, 'ofertas'), orderBy('fechaCreacion', 'desc'));
        const ofertasSnapshot = await getDocs(ofertasQuery);
        const ofertasData = ofertasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaInicio: doc.data().fechaInicio?.toDate(),
          fechaFin: doc.data().fechaFin?.toDate(),
          fechaCreacion: doc.data().fechaCreacion?.toDate()
        }));
        setOfertas(ofertasData);

        // Cargar productos
        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosData = productosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosData);

        // Cargar categorías
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategorias(categoriasData);

        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cargarOfertas = async () => {
    try {
      const ofertasQuery = query(collection(db, 'ofertas'), orderBy('fechaCreacion', 'desc'));
      const ofertasSnapshot = await getDocs(ofertasQuery);
      const ofertasData = ofertasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fechaInicio: doc.data().fechaInicio?.toDate(),
        fechaFin: doc.data().fechaFin?.toDate(),
        fechaCreacion: doc.data().fechaCreacion?.toDate()
      }));
      setOfertas(ofertasData);
    } catch (error) {
      console.error('Error cargando ofertas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Reset campos dependientes cuando cambia el tipo
    if (name === 'tipoOferta') {
      setFormData(prev => ({
        ...prev,
        productosIds: [],
        categoriaId: '',
        subcategoriaId: ''
      }));
      setProductSearchTerm('');
      setShowProductSelector(false);
    }

    // Reset subcategoría cuando cambia categoría
    if (name === 'categoriaId') {
      setFormData(prev => ({
        ...prev,
        subcategoriaId: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación adicional para productos
    if (formData.tipoOferta === 'producto' && formData.productosIds.length === 0) {
      alert('Debes seleccionar al menos un producto para la oferta.');
      return;
    }
    
    try {
      const ofertaData = {
        ...formData,
        descuentoPorcentaje: parseFloat(formData.descuentoPorcentaje),
        fechaInicio: new Date(formData.fechaInicio),
        fechaFin: formData.sinFechaFin ? null : new Date(formData.fechaFin),
        fechaCreacion: new Date()
      };

      // Para compatibilidad con el código existente, si solo hay un producto, guardamos también productoId
      if (formData.tipoOferta === 'producto' && formData.productosIds.length === 1) {
        ofertaData.productoId = formData.productosIds[0];
      }

      if (editingOffer) {
        await updateDoc(doc(db, 'ofertas', editingOffer.id), ofertaData);
      } else {
        await addDoc(collection(db, 'ofertas'), ofertaData);
      }

      // Reset formulario
      setFormData({
        nombre: '',
        descripcion: '',
        tipoOferta: 'producto',
        productosIds: [],
        categoriaId: '',
        subcategoriaId: '',
        descuentoPorcentaje: '',
        fechaInicio: '',
        fechaFin: '',
        activa: true,
        sinFechaFin: false
      });
      setProductSearchTerm('');
      setShowProductSelector(false);
      setShowForm(false);
      setEditingOffer(null);
      cargarOfertas();

    } catch (error) {
      console.error('Error guardando oferta:', error);
      alert('Error al guardar la oferta. Intenta de nuevo.');
    }
  };

  const handleEdit = (oferta) => {
    setEditingOffer(oferta);
    setFormData({
      nombre: oferta.nombre,
      descripcion: oferta.descripcion,
      tipoOferta: oferta.tipoOferta,
      productosIds: oferta.productosIds || (oferta.productoId ? [oferta.productoId] : []), // Compatibilidad con ofertas existentes
      categoriaId: oferta.categoriaId || '',
      subcategoriaId: oferta.subcategoriaId || '',
      descuentoPorcentaje: oferta.descuentoPorcentaje.toString(),
      fechaInicio: oferta.fechaInicio ? oferta.fechaInicio.toISOString().slice(0, 16) : '',
      fechaFin: oferta.fechaFin ? oferta.fechaFin.toISOString().slice(0, 16) : '',
      activa: oferta.activa,
      sinFechaFin: !oferta.fechaFin
    });
    setProductSearchTerm('');
    setShowProductSelector(oferta.tipoOferta === 'producto');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      try {
        await deleteDoc(doc(db, 'ofertas', id));
        cargarOfertas();
      } catch (error) {
        console.error('Error eliminando oferta:', error);
        alert('Error al eliminar la oferta.');
      }
    }
  };

  const toggleActiva = async (oferta) => {
    try {
      await updateDoc(doc(db, 'ofertas', oferta.id), {
        activa: !oferta.activa
      });
      cargarOfertas();
    } catch (error) {
      console.error('Error actualizando oferta:', error);
      alert('Error al actualizar la oferta.');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin');
    }
  };

  // Filtrar ofertas
  const filteredOffers = ofertas.filter(oferta => {
    const searchLower = searchTerm.toLowerCase();
    return (
      oferta.nombre?.toLowerCase().includes(searchLower) ||
      oferta.descripcion?.toLowerCase().includes(searchLower)
    );
  });

  // Paginación
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Funciones para manejar selección de productos
  const handleProductToggle = (productoId) => {
    setFormData(prev => ({
      ...prev,
      productosIds: prev.productosIds.includes(productoId)
        ? prev.productosIds.filter(id => id !== productoId)
        : [...prev.productosIds, productoId]
    }));
  };

  const handleSelectAllProducts = () => {
    const filteredProductsIds = getFilteredProducts().map(p => p.id);
    setFormData(prev => ({
      ...prev,
      productosIds: filteredProductsIds
    }));
  };

  const handleDeselectAllProducts = () => {
    setFormData(prev => ({
      ...prev,
      productosIds: []
    }));
  };

  // Filtrar productos para búsqueda
  const getFilteredProducts = () => {
    return productos.filter(producto => 
      producto.nombre.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  };

  const getSelectedProductsNames = () => {
    if (formData.productosIds.length === 0) return 'Ningún producto seleccionado';
    const selectedProducts = productos.filter(p => formData.productosIds.includes(p.id));
    if (selectedProducts.length <= 2) {
      return selectedProducts.map(p => p.nombre).join(', ');
    }
    return `${selectedProducts.slice(0, 2).map(p => p.nombre).join(', ')} y ${selectedProducts.length - 2} más`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Obtener nombre del objetivo de la oferta
  const getOfferTarget = (oferta) => {
    if (oferta.tipoOferta === 'producto') {
      // Manejar múltiples productos o producto único (compatibilidad)
      const productosIds = oferta.productosIds || (oferta.productoId ? [oferta.productoId] : []);
      if (productosIds.length === 0) return 'Sin productos';
      if (productosIds.length === 1) {
        const producto = productos.find(p => p.id === productosIds[0]);
        return producto ? `Producto: ${producto.nombre}` : 'Producto eliminado';
      }
      const productosNombres = productosIds.map(id => {
        const producto = productos.find(p => p.id === id);
        return producto ? producto.nombre : 'Eliminado';
      }).filter(nombre => nombre !== 'Eliminado');
      return `${productosNombres.length} productos: ${productosNombres.slice(0, 2).join(', ')}${productosNombres.length > 2 ? '...' : ''}`;
    } else if (oferta.tipoOferta === 'categoria') {
      const categoria = categorias.find(c => c.id === oferta.categoriaId);
      return categoria ? `Categoría: ${categoria.name}` : 'Categoría eliminada';
    } else if (oferta.tipoOferta === 'subcategoria') {
      const categoria = categorias.find(c => c.id === oferta.categoriaId);
      const subcategoria = categoria?.subcategories?.find(s => s.id === oferta.subcategoriaId);
      return subcategoria ? `Subcategoría: ${subcategoria.name}` : 'Subcategoría eliminada';
    }
  };

  // Verificar si la oferta está activa por fecha
  const isOfferActiveByDate = (oferta) => {
    const now = new Date();
    const inicio = oferta.fechaInicio;
    const fin = oferta.fechaFin;
    
    if (!inicio) return false;
    if (inicio > now) return false;
    if (fin && fin < now) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestionar Ofertas
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Actions y Búsqueda */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Lista de Ofertas ({filteredOffers.length}{searchTerm ? ` de ${ofertas.length}` : ''})
              </h2>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingOffer(null);
                  setFormData({
                    nombre: '',
                    descripcion: '',
                    tipoOferta: 'producto',
                    productosIds: [],
                    categoriaId: '',
                    subcategoriaId: '',
                    descuentoPorcentaje: '',
                    fechaInicio: '',
                    fechaFin: '',
                    activa: true,
                    sinFechaFin: false
                  });
                  setProductSearchTerm('');
                  setShowProductSelector(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {showForm ? 'Cancelar' : '🏷️ Crear Oferta'}
              </button>
            </div>
            
            {/* Barra de búsqueda */}
            {!showForm && (
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar ofertas por nombre o descripción..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white shadow-lg rounded-xl p-8 mb-6 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
                </h3>
                <p className="text-gray-600">
                  {editingOffer ? 'Modifica los datos de la oferta' : 'Completa la información de la nueva oferta'}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Información Básica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Oferta *</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej: Descuento Black Friday"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descuento (%) *</label>
                      <input
                        type="number"
                        name="descuentoPorcentaje"
                        required
                        min="1"
                        max="99"
                        value={formData.descuentoPorcentaje}
                        onChange={handleInputChange}
                        placeholder="15"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Oferta *</label>
                      <select
                        name="tipoOferta"
                        required
                        value={formData.tipoOferta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                      >
                        <option value="producto">Producto específico</option>
                        <option value="categoria">Categoría completa</option>
                        <option value="subcategoria">Subcategoría completa</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Objetivo de la oferta */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Objetivo de la Oferta</h4>
                  
                  {formData.tipoOferta === 'producto' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar Productos *</label>
                      
                      {/* Resumen de productos seleccionados */}
                      <div className="mb-4 p-3 bg-gray-100 rounded-lg border">
                        <div className="text-sm text-gray-700">
                          <strong>{formData.productosIds.length}</strong> productos seleccionados
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getSelectedProductsNames()}
                        </div>
                      </div>

                      {/* Botón para mostrar/ocultar selector */}
                      <button
                        type="button"
                        onClick={() => setShowProductSelector(!showProductSelector)}
                        className="w-full mb-4 px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-200 flex justify-between items-center"
                      >
                        <span className="text-gray-700">
                          {showProductSelector ? 'Ocultar selector de productos' : 'Mostrar selector de productos'}
                        </span>
                        <svg 
                          className={`h-5 w-5 text-gray-400 transform transition-transform ${showProductSelector ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Selector de productos */}
                      {showProductSelector && (
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          {/* Búsqueda de productos */}
                          <div className="mb-4">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                placeholder="Buscar productos por nombre..."
                                value={productSearchTerm}
                                onChange={(e) => setProductSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                          </div>

                          {/* Acciones masivas */}
                          <div className="flex gap-2 mb-4">
                            <button
                              type="button"
                              onClick={handleSelectAllProducts}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Seleccionar todos ({getFilteredProducts().length})
                            </button>
                            <button
                              type="button"
                              onClick={handleDeselectAllProducts}
                              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                              Deseleccionar todos
                            </button>
                          </div>

                          {/* Lista de productos */}
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {getFilteredProducts().length === 0 ? (
                              <p className="text-gray-500 text-center py-4">
                                {productSearchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                              </p>
                            ) : (
                              getFilteredProducts().map((producto) => (
                                <label
                                  key={producto.id}
                                  className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.productosIds.includes(producto.id)}
                                    onChange={() => handleProductToggle(producto.id)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {producto.nombre}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                      ${new Intl.NumberFormat('es-CL').format(producto.precio)}
                                      {producto.descripcion && ` • ${producto.descripcion.substring(0, 50)}${producto.descripcion.length > 50 ? '...' : ''}`}
                                    </div>
                                  </div>
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Validación */}
                      {formData.productosIds.length === 0 && (
                        <p className="text-sm text-red-600 mt-2">
                          * Debes seleccionar al menos un producto
                        </p>
                      )}
                    </div>
                  )}

                  {formData.tipoOferta === 'categoria' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Seleccionar Categoría *</label>
                      <select
                        name="categoriaId"
                        required
                        value={formData.categoriaId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.tipoOferta === 'subcategoria' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
                        <select
                          name="categoriaId"
                          required
                          value={formData.categoriaId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                        >
                          <option value="">Selecciona una categoría</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategoría *</label>
                        <select
                          name="subcategoriaId"
                          required
                          value={formData.subcategoriaId}
                          onChange={handleInputChange}
                          disabled={!formData.categoriaId}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                        >
                          <option value="">Selecciona una subcategoría</option>
                          {formData.categoriaId && 
                            categorias.find(cat => cat.id === formData.categoriaId)?.subcategories?.map((subcat) => (
                              <option key={subcat.id} value={subcat.id}>
                                {subcat.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fechas */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Periodo de la Oferta</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha y Hora de Inicio *</label>
                        <input
                          type="datetime-local"
                          name="fechaInicio"
                          required
                          value={formData.fechaInicio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha y Hora de Fin</label>
                        <input
                          type="datetime-local"
                          name="fechaFin"
                          value={formData.fechaFin}
                          onChange={handleInputChange}
                          disabled={formData.sinFechaFin}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="sinFechaFin"
                        id="sinFechaFin"
                        checked={formData.sinFechaFin}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sinFechaFin" className="ml-2 block text-sm text-gray-700">
                        Sin fecha de finalización (hasta retirar manualmente)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Descripción</h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción de la Oferta</label>
                    <textarea
                      name="descripcion"
                      rows={3}
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Describe los términos y condiciones de la oferta..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingOffer(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {editingOffer ? '💾 Actualizar Oferta' : '🏷️ Crear Oferta'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Ofertas */}
          {!showForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {filteredOffers.length === 0 ? (
                <div className="text-center py-12">
                  {searchTerm ? (
                    <>
                      <p className="text-gray-500">No se encontraron ofertas que coincidan con "<span className="font-medium">{searchTerm}</span>"</p>
                      <p className="text-sm text-gray-400">Intenta con otros términos de búsqueda</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500">No hay ofertas registradas</p>
                      <p className="text-sm text-gray-400">Crea tu primera oferta usando el botón de arriba</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Oferta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descuento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Objetivo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vigencia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOffers.map((oferta) => {
                        const isActiveByDate = isOfferActiveByDate(oferta);
                        const isFullyActive = oferta.activa && isActiveByDate;
                        
                        return (
                          <tr key={oferta.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {oferta.nombre}
                                </div>
                                {oferta.descripcion && (
                                  <div className="text-sm text-gray-500">
                                    {oferta.descripcion.substring(0, 50)}{oferta.descripcion.length > 50 ? '...' : ''}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-green-600">
                                {oferta.descuentoPorcentaje}% OFF
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getOfferTarget(oferta)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                isFullyActive
                                  ? 'bg-green-100 text-green-800'
                                  : oferta.activa && !isActiveByDate
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isFullyActive ? 'Activa' : oferta.activa && !isActiveByDate ? 'Programada' : 'Inactiva'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>
                                <div>Inicio: {oferta.fechaInicio?.toLocaleDateString('es-CL')}</div>
                                <div>
                                  {oferta.fechaFin 
                                    ? `Fin: ${oferta.fechaFin.toLocaleDateString('es-CL')}`
                                    : 'Sin fecha de fin'
                                  }
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => toggleActiva(oferta)}
                                className={`${
                                  oferta.activa ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {oferta.activa ? 'Pausar' : 'Activar'}
                              </button>
                              <button
                                onClick={() => handleEdit(oferta)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(oferta.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{indexOfFirstOffer + 1}</span> al{' '}
                            <span className="font-medium">{Math.min(indexOfLastOffer, filteredOffers.length)}</span> de{' '}
                            <span className="font-medium">{filteredOffers.length}</span> ofertas
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Anterior</span>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                              let pageNumber;
                              if (totalPages <= 5) {
                                pageNumber = i + 1;
                              } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i;
                              } else {
                                pageNumber = currentPage - 2 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === pageNumber
                                      ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}
                            
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Siguiente</span>
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};