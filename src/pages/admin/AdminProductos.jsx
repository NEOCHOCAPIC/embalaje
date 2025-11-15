import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/admin/ImageUpload';


export const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    subcategoria: '',
    stock: '',
    imagen: ''
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Cargar productos y categorías al inicializar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
       
          const categoriasData = categoriasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCategorias(categoriasData);
        

        // Cargar productos
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cargarProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      const productosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      imagen: imageUrl
    }));
  };

  const formatPrice = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(parseInt(numericValue));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      precio: numericValue
    }));
  };

  // Filtrar productos basado en búsqueda
  const filteredProducts = productos.filter(producto => {
    const searchLower = searchTerm.toLowerCase();
    return (
      producto.nombre?.toLowerCase().includes(searchLower) ||
      producto.descripcion?.toLowerCase().includes(searchLower) ||
      producto.categoria?.toLowerCase().includes(searchLower) ||
      producto.subcategoria?.toLowerCase().includes(searchLower)
    );
  });

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Función para cambiar página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset página cuando se busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        fechaCreacion: new Date()
      };

      if (editingProduct) {
        // Actualizar producto existente
        await updateDoc(doc(db, 'productos', editingProduct.id), productData);
      } else {
        // Crear nuevo producto
        await addDoc(collection(db, 'productos'), productData);
      }

      // Resetear formulario
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        subcategoria: '',
        stock: '',
        imagen: ''
      });
      setShowForm(false);
      setEditingProduct(null);
      cargarProductos(); // Recargar lista

    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto. Intenta de nuevo.');
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      categoria: producto.categoria,
      subcategoria: producto.subcategoria || '',
      stock: producto.stock.toString(),
      imagen: producto.imagen || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'productos', id));
        cargarProductos(); // Recargar lista
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto.');
      }
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
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
                Administrar Productos
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
                Lista de Productos ({filteredProducts.length}{searchTerm ? ` de ${productos.length}` : ''})
              </h2>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingProduct(null);
                  setFormData({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    categoria: '',
                    subcategoria: '',
                    stock: '',
                    imagen: ''
                  });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {showForm ? 'Cancelar' : 'Añadir Producto'}
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
                  placeholder="Buscar productos por nombre, descripción, categoría..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <p className="text-gray-600">
                  {editingProduct ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Información Básica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto *</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej: Film Stretch Negro"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (CLP) *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="precio"
                          required
                          value={formData.precio ? formatPrice(formData.precio) : ''}
                          onChange={handlePriceChange}
                          placeholder="$0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 pl-8"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium">$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categorización */}
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Categorización</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
                      <select
                        name="categoria"
                        required
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategoría *</label>
                      <select
                        name="subcategoria"
                        required
                        value={formData.subcategoria}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                        disabled={!formData.categoria}
                      >
                        <option value="">Selecciona una subcategoría</option>
                        {formData.categoria && 
                          categorias.find(cat => cat.id === formData.categoria)?.subcategories?.map((subcat) => (
                            <option key={subcat.id} value={subcat.id}>
                              {subcat.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Inventario</h4>
                  <div className="max-w-xs">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Disponible *</label>
                    <input
                      type="number"
                      name="stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Descripción del Producto</h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción Detallada *</label>
                    <textarea
                      name="descripcion"
                      rows={4}
                      required
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Describe las características, usos y beneficios del producto..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Imagen del Producto */}
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">Imagen del Producto</h4>
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={formData.imagen}
                    disabled={false}
                  />
                  
                  {/* Input manual de URL como alternativa */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      O ingresa una URL manualmente:
                    </label>
                    <input
                      type="url"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      setFormData({
                        nombre: '',
                        descripcion: '',
                        precio: '',
                        categoria: '',
                        subcategoria: '',
                        stock: '',
                        imagen: ''
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {editingProduct ? '💾 Actualizar Producto' : '✨ Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Productos */}
          {!showForm && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  {searchTerm ? (
                    <>
                      <p className="text-gray-500">No se encontraron productos que coincidan con "<span className="font-medium">{searchTerm}</span>"</p>
                      <p className="text-sm text-gray-400">Intenta con otros términos de búsqueda</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500">No hay productos registrados</p>
                      <p className="text-sm text-gray-400">Añade tu primer producto usando el botón de arriba</p>
                    </>
                  )}
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((producto) => (
                      <tr key={producto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {producto.imagen && (
                              <img
                                className="h-10 w-10 rounded-lg object-cover mr-3"
                                src={producto.imagen}
                                alt={producto.nombre}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {producto.nombre}
                              </div>
                              <div className="text-sm text-gray-500">
                                {producto.descripcion?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                            minimumFractionDigits: 0
                          }).format(producto.precio || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.categoria}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(producto)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
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
                          Mostrando <span className="font-medium">{indexOfFirstProduct + 1}</span> al{' '}
                          <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> de{' '}
                          <span className="font-medium">{filteredProducts.length}</span> productos
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
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
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