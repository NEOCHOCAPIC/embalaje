export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
      {/* Contenido principal */}
      <div className="px-4 py-12 md:px-6 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {/* Logo y Dirección */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-6">
              <img src="/Logo.png" alt="Pack Mayorista" className="h-12 w-auto" />
            </a>
            <div className="space-y-4 text-sm">
              <p>Plastyfilm SPA, somos especialistas en soluciones de embalaje y protección de productos</p>
            </div>
            {/* Redes Sociales */}
            <div className="flex gap-4 mt-6">
              {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a> */}
              <a href="https://www.instagram.com/plastyfilmspa/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <img src="/IG.svg" className="w-6 h-6" alt="Logo instagram" />
              </a>
            </div>
          </div>
          
          {/* Navegación Rápida */}
          <div>
            <h3 className="font-bold text-lg mb-5 text-white border-b-2 border-indigo-500 pb-2 inline-block">Navegación</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <a href="/productos" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Productos
                </a>
              </li>
              <li>
                <a href="/ofertas" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Ofertas
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-5 text-white border-b-2 border-indigo-500 pb-2 inline-block">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+56973157810" className="text-white/80 hover:text-white transition-colors">
                  +56 9 7315 7810
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:ventas@plastyfilmspa.cl" className="text-white/80 hover:text-white transition-colors break-all">
                  ventas@plastyfilmspa.cl
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-white/80">
                  <p className="font-medium text-white">Lun - Vie</p>
                  <p>9:00 - 18:00 hrs</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Dirección */}
          <div>
            <h3 className="font-bold text-lg mb-5 text-white border-b-2 border-indigo-500 pb-2 inline-block">Ubicación</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 group">
                <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-white/80 leading-relaxed">
                  <p className="font-medium text-white mb-1">Av. Américo Vespucio 1001</p>
                  <p>Quilicura, Santiago</p>
                  <p>Planta 3, Bodega 25/26</p>
                  <p className="text-xs text-white/60 mt-1">(Megacentro Cordillera)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-white/10 px-4 py-6 md:px-6 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-white/70">© 2025 Plastyfilm SPA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="text-white/50">Desarrollado por</span>
            <a 
              href="https://www.webmakerchile.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              Webmakerchile
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
