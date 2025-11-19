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
import { SEO } from './components/SEO';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            <>
              <SEO 
                title="Plastyfilm SPA - Film Stretch y Embalaje Industrial | Chile"
                description="Distribuidor líder de film stretch, embalaje industrial y soluciones de empaque en Chile. Envío rápido, precios mayoristas. ¡Contáctanos!"
                keywords="film stretch, embalaje industrial, film plástico, stretch film, embalaje Chile, plastyfilm, empaque industrial, film adherente"
                canonical="https://plastyfilm.cl/"
              />
              <Header />
              <Hero />
             <Destacados />
              <Nosotros />
              <WhatsAppButton />
              <Footer />
            </>
          } />
           {/* Rutas públicas */}
          <Route path="/productos" element={<><Productos /><WhatsAppButton /></>} />
          <Route path="/productos/:categoriaId" element={<><Productos /><WhatsAppButton /></>} />
          <Route path="/productos/:categoriaId/:subcategoriaId" element={<><Productos /><WhatsAppButton /></>} />
          <Route path="/ofertas" element={<><OfertasPage /><WhatsAppButton /></>} />
          <Route path="/contacto" element={<><Contact /><WhatsAppButton /></>} />
          <Route path="/producto/:productoId" element={<><ProductoDetalle /><WhatsAppButton /></>} />
          
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
