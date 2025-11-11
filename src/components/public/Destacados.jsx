export function Destacados() { 

return (

 <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Productos Destacados</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { title: 'Film Stretch Transparente', image: 'https://media.prodalam.cl/media-pim/104168/104168_20240613134027.jpg?d=20240613134027', link: '#' },
                      { title: 'Film Stretch Negro', image: 'https://lapizarralibreria.cl/wp-content/uploads/2021/07/stretch-film-negro.jpg', link: '#' },
                      { title: 'Film Stretch Colores', image: 'https://todofilm.cl/wp-content/uploads/2022/10/stretch-film-colores.jpeg', link: '#' },
                    ].map((product, index) => (
                      <a key={index} href={product.link} className="group block text-center">
                        <img src={product.image} alt={product.title} className="w-full h-56 object-cover mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">Ver colección →</p>
                      </a>
                    ))}
                  </div>
                </div>
              </section>









)



}