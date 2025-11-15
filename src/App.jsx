import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Header } from './components/layout/Header'
import { Hero } from './components/public/Hero'
import { Footer } from './components/layout/Footer'
import { LoginAdmin } from './pages/admin/LoginAdmin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminProductos } from './pages/admin/AdminProductos'
import { AdminOfertas } from './pages/admin/AdminOfertas'
import Contact from './pages/Contact';
import Productos from './pages/Productos'
import { OfertasPage } from './pages/Ofertas'
import WhatsAppButton from './components/Wsp'
import { Destacados } from './components/public/Destacados'
import Nosotros from './components/public/Nosotros'
import ProductoDetalle from './pages/ProductoDetalle';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            <>
              <Header />
              <Hero />
             <Destacados />
              <Nosotros />
              <WhatsAppButton />
              <Footer />
            </>
          } />
           {/* Rutas públicas */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:categoriaId" element={<Productos />} />
          <Route path="/productos/:categoriaId/:subcategoriaId" element={<Productos />} />
          <Route path="/ofertas" element={<OfertasPage />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/producto/:productoId" element={<ProductoDetalle />} />
          
          {/* Rutas de admin */}
          <Route path="/admin" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/productos" element={
            <ProtectedRoute>
              <AdminProductos />
            </ProtectedRoute>
          } />
          <Route path="/admin/ofertas" element={
            <ProtectedRoute>
              <AdminOfertas />
            </ProtectedRoute>
          } />
          
         
        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
