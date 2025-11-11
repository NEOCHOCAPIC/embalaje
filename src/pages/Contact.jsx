import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';


// Ícono de Teléfono
const PhoneSVG = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>

);

// Ícono de Correo (Envelope)
const EnvelopeSVG = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>

);

// Ícono de Ubicación (Map Pin)
const MapPinSVG = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

// Ícono de Horario (Clock)
const ClockSVG = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);


// --- 2. Información de Contacto ---

const contactInfo = [
  {
    icon: PhoneSVG, // Componente SVG
    title: "Llámanos",
    detail: "+56 9 1234 5678",
    href: "tel:+56912345678"
  },
  {
    icon: EnvelopeSVG, // Componente SVG
    title: "Escríbenos",
    detail: "contacto@plastyfilm.cl",
    href: "mailto:contacto@plastyfilm.cl"
  },
  {
    icon: MapPinSVG, // Componente SVG
    title: "Nuestra Ubicación",
    detail: "Calle Falsa 123, Santiago, Chile",
    href: "#map"
  },
  {
    icon: ClockSVG, // Componente SVG
    title: "Horario de Atención",
    detail: "Lun - Vie: 9:00 - 18:00 hrs",
    href: "#"
  }
];


// --- 3. Componente Principal ---

function Contact() {
  return (
    <>
      <Header /> 
      
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado */}
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold tracking-wider text-indigo-600 uppercase">HABLEMOS</h2>
            <p className="mt-2 text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
              Ponte en <span className="text-indigo-600">Contacto</span>
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
              Estamos listos para responder tus consultas sobre embalajes y cotizaciones.
            </p>
          </div>

          {/* Contenido Principal: Información y Formulario */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            
            {/* Columna 1: Información de Contacto (Lado Izquierdo) */}
            <div className="lg:col-span-4 bg-indigo-700 p-8 rounded-2xl shadow-xl mb-10 lg:mb-0">
              <h3 className="text-2xl font-bold text-white mb-6">Detalles de Plastyfilm</h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.href}
                    className="flex items-start group transition duration-300 transform hover:scale-[1.03]"
                  >
                    {/* Renderizado del Componente SVG y aplicación de clases */}
                    <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-300 group-hover:text-white transition duration-300" aria-hidden="true" />
                    
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-md text-indigo-200 group-hover:text-white transition duration-300">{item.detail}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Columna 2: Formulario (Lado Derecho) */}
            <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-xl">
              <form className="space-y-6">
                {/* Campo Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Tu nombre completo"
                    className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-base transition duration-200"
                    required
                  />
                </div>
                {/* Campo Correo */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ejemplo@correo.cl"
                    className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-base transition duration-200"
                    required
                  />
                </div>
                {/* Campo Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+56 9 XXXXXXXX"
                    className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-base transition duration-200"
                    required
                  />
                </div>
                {/* Campo Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje / Consulta</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Describe tu requerimiento (ej: cotización de film, consulta de stock, etc.)"
                    className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-base transition duration-200"
                    required
                  ></textarea>
                </div>
                
                {/* Botón */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.005]"
                  >
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Sección de Mapa (Opcional) */}
          <div className="mt-16 bg-white p-6 rounded-2xl shadow-xl">
              <h3 id="map" className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-indigo-600 pl-3">Dónde Encontrarnos</h3>
              <div className="aspect-w-16 aspect-h-9">
                  <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border border-dashed border-gray-400">
                    [Contenedor del Mapa de Google]
                  </div>
              </div>
          </div>

        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default Contact;