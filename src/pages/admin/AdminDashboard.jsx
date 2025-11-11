import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin');
    }
  };

  const dashboardItems = [
    {
      title: 'Administrar Productos',
      description: 'Añadir, editar y gestionar el inventario de productos',
      icon: '📦',
      path: '/admin/productos',
      color: 'bg-blue-500'
    },
    {
      title: 'Ver Pedidos',
      description: 'Gestionar y revisar pedidos de clientes',
      icon: '📋',
      path: '/admin/pedidos',
      color: 'bg-green-500'
    },
    {
      title: 'Configuración',
      description: 'Configurar ajustes generales de la tienda',
      icon: '⚙️',
      path: '/admin/configuracion',
      color: 'bg-purple-500'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes de ventas',
      icon: '📊',
      path: '/admin/reportes',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {dashboardItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`shrink-0 p-3 ${item.color} rounded-md`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.title}
                        </dt>
                        <dd className="text-sm text-gray-900 mt-1">
                          {item.description}
                        </dd>
                      </dl>
                    </div>
                    <div className="shrink-0">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Resumen Rápido
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Productos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Pedidos</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$0</div>
                    <div className="text-sm text-gray-600">Ventas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};