export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Contenido principal */}
      <div className="px-4 py-12 md:px-6 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo y Dirección */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-6">
              <img src="/Logo.png" alt="Pack Mayorista" className="h-12 w-auto" />
            </a>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-base mb-2">Dirección</h3>
                <p className="text-white/90">Visitanos en Avenida tanto, RM, Santiago.</p>
              </div>
              <div>
                <p className="text-white/90">Bodega 1234</p>
              </div>
              <div>
                <p className="text-white/90">Centro de bodegas </p>
              </div>
            </div>
            {/* Redes Sociales */}
            <div className="flex gap-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.588.147-1.079.351-1.537.809-.458.458-.662.949-.809 1.537-.266.788-.467 1.658-.527 2.936C.015 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.527 2.936.147.588.351 1.079.809 1.537.458.458.949.662 1.537.809.788.266 1.658.467 2.936.527C8.333 23.985 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.527.588-.147 1.079-.351 1.537-.809.458-.458.662-.949.809-1.537.266-.788.467-1.658.527-2.936.058-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.527-2.936-.147-.588-.351-1.079-.809-1.537-.458-.458-.949-.662-1.537-.809-.788-.266-1.658-.467-2.936-.527C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.054 1.805.244 2.227.408.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z"/>
                  <circle cx="12" cy="12" r="3.846"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Pack Mayorista */}
          <div>
            <h3 className="font-bold text-base mb-6">Pack Mayorista</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="text-white/90 hover:text-secondary transition">Home</a></li>
              <li><a href="/productos" className="text-white/90 hover:text-secondary transition">Productos</a></li>
              <li><a href="/ofertas" className="text-white/90 hover:text-secondary transition">Ofertas</a></li>
              <li><a href="/faq" className="text-white/90 hover:text-secondary transition">FAQ</a></li>
              <li><a href="/venta-mayorista" className="text-white/90 hover:text-secondary transition">Venta Mayorista</a></li>
              <li><a href="/contacto" className="text-white/90 hover:text-secondary transition">Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-white/20 px-4 py-6 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-white/80">© 2025 Todos los derechos reservados.</p>
          <a href="https://www.webmakerchile.com/" target="_blank" className="text-white/80 hover:text-secondary transition">Webmakerchile</a>
        </div>
      </div>
    </footer>
  )
}
