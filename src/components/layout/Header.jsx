import { useState, useEffect } from 'react'
import { getCategorias } from '../../lib/categoriesService.js'

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const ChevronDownIcon = () => (
  <img src="/arrow.svg" alt="Chevron" className="w-4 h-4 inline ml-1" />
)

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
export function Header() {
  const [showPromo, setShowPromo] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)
  const [promoIndex, setPromoIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('film')
  const [categories, setCategories] = useState([])
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)

  const promoMessages = [
    'Despacho gratis en la RM por compras sobre $100.000',
    'Despacho entre 1 a 2 días'
  ]

  // Cargar categorías desde Firestore
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const cats = await getCategorias()
        setCategories(cats)
        // Establecer la primera categoría como activa
        if (cats.length > 0) {
          setActiveCategory(cats[0].id)
        }
      } catch (error) {
        console.error('Error cargando categorías:', error)
      }
    }
    loadCategorias()
  }, [])

  // Cambiar mensaje 
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Detectar scroll 
  useEffect(() => {
    const handleScroll = () => {
      setShowPromo(window.scrollY <= 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

 
  const handleMobileMenuToggle = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleCategoryToggle = (categoryId) => {
    setActiveCategory((prevCategory) => (prevCategory === categoryId ? null : categoryId));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Banner de promoción */}
      <div className={`overflow-hidden transition-all duration-300 will-change-[max-height] ${showPromo ? 'max-h-12' : 'max-h-0'}`} style={{ transitionTimingFunction: 'ease-in-out' }}>
        <div className="bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
          {promoMessages[promoIndex]}
        </div>
      </div>

      {/* Header principal */}
      <div className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img src="/Logo.png" alt="Pack Mayorista" className="h-12 md:h-14 w-auto" />
            </a>
          </div>

          {/* Buscador - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="w-full flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
              
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="flex-1 px-4 py-2 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm"
              />
              <button className="px-3 py-2 text-black hover:text-black transition">
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Iconos derechos */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              className="md:hidden text-black hover:text-gray-600 transition"
              onClick={() => setActiveMenu(activeMenu ? null : 'menu')}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Navegación principal - Hidden on mobile */}
      <nav className="hidden md:flex border-t border-gray-200 bg-white">
        <a href="/" className="px-4 py-3 text-black font-medium text-sm border-b-3 border-black hover:text-primary transition">
          Home
        </a>
        
        {/* Productos con submenu */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu('productos')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <a href="/productos" className="px-4 py-3 text-black font-medium text-sm hover:text-primary transition flex items-center">
            Productos <ChevronDownIcon />
          </a>
          {activeMenu === 'productos' && (
            <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg z-50 flex">
              {/* Panel izquierdo: Categorías */}
              <div className="w-48 border-r border-gray-200">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/productos/${cat.id}`}
                    onMouseEnter={() => setActiveCategory(cat.id)}
                    onClick={() => setActiveMenu(null)}
                    className={`w-full block px-4 py-3 text-left text-sm font-medium transition ${
                      activeCategory === cat.id 
                        ? 'bg-gray-100 text-primary border-l-3 border-primary' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
              {/* Panel derecho: Subcategorías */}
              <div className="w-56 bg-gray-50">
                {categories.find(c => c.id === activeCategory)?.subcategories?.map((subcat, idx) => (
                  <a
                    key={idx}
                    href={`/productos/${activeCategory}/${encodeURIComponent(subcat.id)}`}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-white hover:text-primary transition border-b border-gray-200 last:border-b-0"
                  >
                    {subcat.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <a href="/ofertas" className="px-4 py-3 text-black font-medium text-sm hover:text-primary transition">
          Ofertas
        </a>
        {/* <a href="/faq" className="px-4 py-3 text-black font-medium text-sm hover:text-primary transition">
          FAQ
        </a>
        <a href="/venta-mayorista" className="px-4 py-3 text-black font-medium text-sm hover:text-primary transition">
          Venta Mayorista
        </a> */}
        <a href="/contacto" className="px-4 py-3 text-black font-medium text-sm hover:text-primary transition">
          Contacto
        </a>
      </nav>

      
      {/* Menú móvil */}
      {activeMenu === 'menu' && (
        <div className="md:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-120px)] overflow-y-auto">
          <a href="/" className="block px-4 py-3 text-black font-medium text-base border-b border-gray-100 hover:bg-gray-50 transition">
            Home
          </a>
          <div className="border-b border-gray-100">
            <button 
              className="w-full px-4 py-3 text-black font-medium text-base hover:bg-gray-50 transition flex justify-between items-center"
              
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
            >
              Productos
             
              <svg className={`w-5 h-5 transition transform ${mobileProductsOpen ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
           
            {mobileProductsOpen && (
              <div className="bg-gray-50">
                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-200">
                   
                    <a
                      href={`/productos/${cat.id}`}
                      onClick={(e) => {
                        
                      }}
                      className="w-full block px-4 py-3 text-black text-sm font-medium text-left hover:bg-white transition border-b border-gray-100"
                    >
                      {cat.name}
                    </a>
                    <button
                      onClick={() => handleCategoryToggle(cat.id)}
                      className="w-full px-4 py-2 text-black text-sm font-medium text-left hover:bg-white transition flex justify-between items-center"
                    >
                      <span className="text-xs text-gray-500">Subcategorías</span>
                      <svg
                        className={`w-4 h-4 transition transform ${activeCategory === cat.id ? 'rotate-90' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {activeCategory === cat.id && (
                      <div className="bg-gray-100">
                        {cat.subcategories.map((subcat, idx) => (
                          <a
                            key={idx}
                            href={`/productos/${cat.id}/${encodeURIComponent(subcat.id)}`}
                            className="block px-6 py-2 text-gray-700 text-xs hover:text-black hover:bg-gray-200 transition"
                          >
                            {subcat.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ... Resto de enlaces ... */}
          <a href="/ofertas" className="block px-4 py-3 text-black font-medium text-base border-b border-gray-100 hover:bg-gray-50 transition">
            Ofertas
          </a>
          <a href="/contacto" className="block px-4 py-3 text-black font-medium text-base hover:bg-gray-50 transition">
            Contacto
          </a>
        </div>
      )}
    </header>
  )
}
