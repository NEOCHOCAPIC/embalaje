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
import Contact from './pages/Contact';
import WhatsAppButton from './components/Wsp'
import { Destacados } from './components/public/Destacados'
import Nosotros from './components/public/Nosotros'

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
          <Route path="/contacto" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
