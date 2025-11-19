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
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Banner de promoción */}
      <div className={`overflow-hidden transition-all duration-500 will-change-[max-height] ${showPromo ? 'max-h-12' : 'max-h-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white border-b border-indigo-700 whitespace-nowrap animate-gradient-x">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
            {promoMessages[promoIndex]}
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div className="px-4 py-4 md:px-6 md:py-5 bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105">
              <img src="/Logo.png" alt="Pack Mayorista" className="h-12 md:h-14 w-auto filter drop-shadow-md" />
            </a>
          </div>

          {/* Buscador - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md relative search-container">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 hover:shadow-md hover:border-indigo-300">
                <div className="pl-4 text-gray-400">
                  <SearchIcon />
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
                <button type="submit" className="px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200 rounded-r-lg">
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
            
            {/* Dropdown de resultados */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fadeIn">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-gray-500 text-sm text-center">
                    {searchLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                        Buscando...
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p>No se encontraron productos</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="flex items-center px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                      >
                        <div className="shrink-0 w-14 h-14 mr-3">
                          {product.imagen ? (
                            <div className="w-full h-full relative overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                              <img
                                src={product.imagen}
                                alt={product.nombre}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.parentElement.querySelector('.fallback-div').style.display = 'flex'
                                }}
                              />
                              <div className="fallback-div w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs absolute inset-0" style={{display: 'none'}}>
                                Sin imagen
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs shadow-sm">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                            {product.nombre}
                          </p>
                          <p className="text-sm font-bold text-indigo-600 truncate mt-1">
                            ${product.precio?.toLocaleString('es-CL')}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                    {searchResults.length >= 8 && (
                      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-indigo-100">
                        <button
                          onClick={() => {
                            navigate(`/productos?search=${encodeURIComponent(searchTerm)}`)
                            setShowSearchResults(false)
                            setSearchTerm('')
                          }}
                          className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center justify-center gap-2 py-2 hover:gap-3 transition-all duration-200"
                        >
                          Ver todos los resultados
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
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
              className="md:hidden text-gray-700 hover:text-indigo-600 transition-all duration-200 p-2 hover:bg-indigo-50 rounded-lg"
              onClick={() => setActiveMenu(activeMenu ? null : 'menu')}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Navegación principal - Hidden on mobile */}
      <nav className="hidden md:flex border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-sm">
        <a href="/" className="px-5 py-3.5 text-gray-800 font-semibold text-sm hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 border-b-2 border-transparent hover:border-indigo-600 relative group">
          <span className="relative z-10">Home</span>
          <span className="absolute inset-0 bg-indigo-100 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-t-lg opacity-0"></span>
        </a>
        
        {/* Productos con submenu */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu('productos')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <a href="/productos" className="px-5 py-3.5 text-gray-800 font-semibold text-sm hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center gap-1 border-b-2 border-transparent hover:border-indigo-600">
            Productos 
            <ChevronDownIcon />
          </a>
          {activeMenu === 'productos' && (
            <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-b-xl shadow-2xl z-50 flex overflow-hidden animate-slideDown">
              {/* Panel izquierdo: Categorías */}
              <div className="w-56 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/productos/${cat.id}`}
                    onMouseEnter={() => setActiveCategory(cat.id)}
                    onClick={() => setActiveMenu(null)}
                    className={`w-full block px-5 py-3.5 text-left text-sm font-semibold transition-all duration-200 group ${
                      activeCategory === cat.id 
                        ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600 border-l-4 border-transparent'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {cat.name}
                      <svg className={`w-4 h-4 transition-transform duration-200 ${activeCategory === cat.id ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
              {/* Panel derecho: Subcategorías */}
              <div className="w-64 bg-white">
                {categories.find(c => c.id === activeCategory)?.subcategories?.map((subcat, idx) => (
                  <a
                    key={idx}
                    href={`/productos/${activeCategory}/${encodeURIComponent(subcat.id)}`}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {subcat.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <a href="/ofertas" className="px-5 py-3.5 text-red-600 font-bold text-sm hover:text-red-700 hover:bg-red-50 transition-all duration-200 flex items-center gap-1 border-b-2 border-transparent hover:border-red-600 animate-pulse-slow">
          🔥 Ofertas
        </a>
        <a href="/contacto" className="px-5 py-3.5 text-gray-800 font-semibold text-sm hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 border-b-2 border-transparent hover:border-indigo-600">
          Contacto
        </a>
      </nav>

      
      {/* Menú móvil */}
      {activeMenu === 'menu' && (
        <div className="md:hidden border-t border-gray-200 bg-white max-h-[calc(100vh-120px)] overflow-y-auto animate-slideDown">
          {/* Buscador móvil */}
          <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full flex items-center border-2 border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                <div className="pl-3 text-gray-400">
                  <SearchIcon />
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar productos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
                <button type="submit" className="px-3 py-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <a href="/" className="block px-4 py-3.5 text-gray-800 font-semibold text-base border-b border-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 active:bg-indigo-100">
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </span>
          </a>
          <div className="border-b border-gray-100">
            <button 
              className="w-full px-4 py-3.5 text-gray-800 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 flex justify-between items-center group active:bg-indigo-100"
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Productos
              </span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${mobileProductsOpen ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
           
            {mobileProductsOpen && (
              <div className="bg-gradient-to-b from-gray-50 to-white animate-slideDown">
                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-200">
                   
                    <a
                      href={`/productos/${cat.id}`}
                      className="w-full block px-5 py-3 text-gray-800 text-sm font-semibold text-left hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 border-b border-gray-100 active:bg-indigo-100"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        {cat.name}
                      </span>
                    </a>
                    <button
                      onClick={() => handleCategoryToggle(cat.id)}
                      className="w-full px-5 py-2.5 text-gray-600 text-xs font-semibold text-left hover:bg-white transition-all duration-200 flex justify-between items-center group"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Subcategorías
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-90' : ''}`}
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
                      <div className="bg-indigo-50 animate-slideDown">
                        {cat.subcategories.map((subcat, idx) => (
                          <a
                            key={idx}
                            href={`/productos/${cat.id}/${encodeURIComponent(subcat.id)}`}
                            className="block px-8 py-2.5 text-gray-700 text-xs font-medium hover:text-indigo-600 hover:bg-white transition-all duration-200 border-b border-indigo-100 last:border-b-0 active:bg-indigo-100"
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              {subcat.name}
                            </span>
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
          <a href="/ofertas" className="block px-4 py-3.5 text-red-600 font-bold text-base border-b border-gray-100 hover:bg-red-50 transition-all duration-200 active:bg-red-100 animate-pulse-slow">
            <span className="flex items-center gap-3">
              🔥 Ofertas
            </span>
          </a>
          <a href="/contacto" className="block px-4 py-3.5 text-gray-800 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 active:bg-indigo-100">
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contacto
            </span>
          </a>
        </div>
      )}
    </header>
  )
}
