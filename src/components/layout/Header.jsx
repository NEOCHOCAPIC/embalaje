import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategorias } from '../../lib/categoriesService.js'
import { getProductos } from '../../lib/productsService.js'

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
  const navigate = useNavigate()
  const [showPromo, setShowPromo] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)
  const [promoIndex, setPromoIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('film')
  const [categories, setCategories] = useState([])
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const promoMessages = [
    'Despacho gratis en la RM por compras sobre $100.000',
    'Despacho entre 1 a 2 días'
  ]

  
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const cats = await getCategorias()
        setCategories(cats)
       
        if (cats.length > 0) {
          setActiveCategory(cats[0].id)
        }
      } catch (error) {
        console.error('Error cargando categorías:', error)
      }
    }
    loadCategorias()
  }, [])

  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProductos()
        setAllProducts(products || [])
      } catch (error) {
        console.error('Error cargando productos:', error)
      }
    }
    loadProducts()
  }, [])

  
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

  
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setSearchLoading(true)
      try {
        const filtered = allProducts.filter(product => 
          product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setSearchResults(filtered.slice(0, 8)) 
        setShowSearchResults(true)
      } catch (error) {
        console.error('Error en búsqueda:', error)
      } finally {
        setSearchLoading(false)
      }
    }

    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, allProducts])

  // Manejar envío del formulario de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`)
      setShowSearchResults(false)
      setSearchTerm('')
    }
  }

  // Manejar clic en resultado de búsqueda
  const handleResultClick = (productId) => {
    navigate(`/producto/${productId}`)
    setShowSearchResults(false)
    setSearchTerm('')
  }

  // Cerrar resultados cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          <div className="hidden md:flex flex-1 max-w-md relative search-container">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm"
                />
                <button type="submit" className="px-3 py-2 text-black hover:text-primary transition">
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    <SearchIcon />
                  )}
                </button>
              </div>
            </form>
            
            {/* Dropdown de resultados */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    {searchLoading ? 'Buscando...' : 'No se encontraron productos'}
                  </div>
                ) : (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="shrink-0 w-12 h-12 mr-3">
                          {product.imagen ? (
                            <div className="w-full h-full relative">
                              <img
                                src={product.imagen}
                                alt={product.nombre}
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.parentElement.querySelector('.fallback-div').style.display = 'flex'
                                }}
                              />
                              <div className="fallback-div w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs absolute inset-0" style={{display: 'none'}}>
                                Sin imagen
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.nombre}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            ${product.precio?.toLocaleString('es-CL')}
                          </p>
                        </div>
                      </div>
                    ))}
                    {searchResults.length >= 8 && (
                      <div className="px-4 py-2 bg-gray-50 border-t">
                        <button
                          onClick={() => {
                            navigate(`/productos?search=${encodeURIComponent(searchTerm)}`)
                            setShowSearchResults(false)
                            setSearchTerm('')
                          }}
                          className="text-sm text-primary hover:text-primary font-medium"
                        >
                          Ver todos los resultados
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
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

        <a href="/ofertas" className="px-4 py-3 text-red-600 font-semibold text-sm hover:text-red-700 transition">
          🔥 Ofertas
        </a>
        <a href="/contacto" className="px-4 py-3 text-black font-medium text-sm hover:text-primary transition">
          Contacto
        </a>
      </nav>

      
      {/* Menú móvil */}
      {activeMenu === 'menu' && (
        <div className="md:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Buscador móvil */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm"
                />
                <button type="submit" className="px-3 py-2 text-black hover:text-primary transition">
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    <SearchIcon />
                  )}
                </button>
              </div>
            </form>
          </div>
          
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
                      onClick={() => {
                        
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
          <a href="/ofertas" className="block px-4 py-3 text-red-600 font-semibold text-base border-b border-gray-100 hover:bg-red-50 transition">
            🔥 Ofertas
          </a>
          <a href="/contacto" className="block px-4 py-3 text-black font-medium text-base hover:bg-gray-50 transition">
            Contacto
          </a>
        </div>
      )}
    </header>
  )
}
