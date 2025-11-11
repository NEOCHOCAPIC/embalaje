export function Hero() {
  return (
    <section className="relative w-full h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/Hero.jpg)' }}>
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          EMBALAJE<br />MAYORISTA
        </h1>
        
        <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
          Stretch Film Transparente, Cinta Adhesiva y Plástico Burbuja a Precio Mayorista
        </p>
        
        <a 
          href="/productos" 
          className="inline-block px-8 py-3 border-2 border-white text-white font-bold text-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
        >
          VER PRODUCTOS
        </a>
      </div>
    </section>
  )
}
