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

export const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: ''
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Cargar productos al inicializar
  useEffect(() => {
    cargarProductos();
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
          {/* Actions */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Lista de Productos ({productos.length})
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
                  stock: '',
                  imagen: ''
                });
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showForm ? 'Cancelar' : 'Añadir Producto'}
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    step="0.01"
                    required
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    required
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    required
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
                  <input
                    type="url"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
                  >
                    {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Productos */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {productos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay productos registrados</p>
                <p className="text-sm text-gray-400">Añade tu primer producto usando el botón de arriba</p>
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
                    {productos.map((producto) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${producto.precio?.toFixed(2)}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};