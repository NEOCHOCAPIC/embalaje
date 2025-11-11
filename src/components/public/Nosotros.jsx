
const CheckCircleSVG = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

);
const UsersIcon = ({ className }) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>

);
const Global = ({ className }) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
</svg>


);
const Rocket = ({ className }) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
</svg>

);
function Nosotros() {

  const keyFeatures = [
    {
      iconSrc: CheckCircleSVG,
      title: "Alta Calidad",
      description: "Comprometidos con ofrecer artículos que garantizan seguridad y eficiencia en cada envío.",
    },
    {
      iconSrc: UsersIcon, 
      title: "Asesoría Experta",
      description: "Brindamos asesoría personalizada para optimizar tus soluciones de embalaje.",
    },
    {
      iconSrc: Global, 
      title: "Amplia Gama",
      description: "Comercialización de films plásticos, cintas adhesivas, cajas, burbujas y más.",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">¿QUIÉNES SOMOS?</h2>
          <p className="mt-2 text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
            Sobre <span className="text-indigo-600">Plastyfilm SPA</span>
          </p>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            Especialistas en soluciones de embalaje y protección para un futuro logístico seguro.
          </p>
        </div>

        {/* Contenido Principal: Texto e Imagen */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Columna de Texto */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-indigo-600 pl-4">
              Nuestro Compromiso con la Calidad
            </h3>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              En Plastyfilm SPA, somos especialistas en soluciones de embalaje y protección de productos. Desde nuestros inicios, hemos trabajado con el compromiso de ofrecer artículos de alta calidad que garanticen seguridad, eficiencia y una excelente presentación en cada envío.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Nos dedicamos a la comercialización de insumos y materiales de embalaje, tales como films plásticos, cintas adhesivas, bolsas, cajas, burbujas y todo lo necesario para el correcto resguardo de productos durante su almacenamiento y transporte.
            </p>
            
            {/* Características clave en tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {keyFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-indigo-50 rounded-xl shadow-md transition duration-300 hover:scale-[1.03] hover:bg-indigo-100 cursor-pointer"
                >
                  {/* Uso de la etiqueta <img> para el icono estático */}
                  <feature.iconSrc 
                    className="h-8 w-8 text-indigo-700 mb-3" 
                    aria-hidden="true" 
                  />
                  <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Columna de Imagen */}
          <div className="lg:col-span-6 mt-12 lg:mt-0 relative order-1 lg:order-2">
            <div className="relative transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl rounded-2xl">
              {/* Ruta de imagen del almacén desde la carpeta public */}
              <img
                src="/about.jpg" 
                alt="Almacén de Plastyfilm SPA con productos de embalaje"
                className="rounded-2xl shadow-xl w-full h-full object-cover"
              />
              {/* Overlay de color sutil para profesionalismo */}
              <div className="absolute inset-0 bg-indigo-900 opacity-10 rounded-2xl mix-blend-multiply"></div>
            </div>
            {/* SVG decorativo en la esquina (como código directo) */}
            <svg className="hidden lg:block absolute -bottom-10 -right-10 w-40 h-40 text-indigo-200 opacity-50 z-[-1]" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <rect x="10" y="10" width="80" height="80" rx="15" stroke="currentColor" strokeWidth="4" />
              <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Sección de Objetivo/Visión (Separada para énfasis) */}
        <div className="mt-20 pt-16 border-t border-gray-200">
            <div className="max-w-4xl mx-auto text-center p-8 bg-indigo-50 rounded-xl shadow-lg transition duration-500 hover:shadow-2xl hover:scale-[1.01]">
                {/* Ícono grande para la sección de objetivo (usando otra imagen estática) */}
                <Rocket 
                    className="mx-auto h-10 w-10 text-indigo-600 mb-4" 
                    aria-hidden="true" 
                />
                <p className="text-2xl font-extrabold text-gray-900">
                    <span className="text-indigo-600">Nuestro Objetivo:</span> Ser un Aliado Estratégico
                </p>
                <p className="mt-4 text-xl text-gray-600">
                    Entregamos asesoría personalizada y productos que se adaptan a las necesidades exactas de cada cliente, asegurando el éxito y el correcto resguardo de sus productos.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Nosotros;
