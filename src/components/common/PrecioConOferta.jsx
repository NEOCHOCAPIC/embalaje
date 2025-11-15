import { getProductOffer, calcularPrecioConDescuento, formatearPrecio } from '../../lib/ofertasService';

export const PrecioConOferta = ({ producto, ofertas, className = "", mostrarAhorro = true }) => {
  const oferta = getProductOffer(producto, ofertas || []);
  
  if (!oferta) {
    // Sin oferta - mostrar precio normal
    return (
      <div className={`${className}`}>
        <span className="text-xl font-bold text-gray-900">
          {formatearPrecio(producto.precio)}
        </span>
      </div>
    );
  }

  // Con oferta - mostrar precio original y con descuento
  const precioOriginal = producto.precio;
  const precioConDescuento = calcularPrecioConDescuento(precioOriginal, oferta.descuentoPorcentaje);
  const ahorro = precioOriginal - precioConDescuento;

  return (
    <div className={`${className}`}>
      <div className="space-y-1">
        {/* Precio original tachado */}
        <div className="text-sm text-gray-500 line-through">
          {formatearPrecio(precioOriginal)}
        </div>
        
        {/* Precio con descuento */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-red-600">
            {formatearPrecio(precioConDescuento)}
          </span>
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{oferta.descuentoPorcentaje}%
          </span>
        </div>
        
        {/* Ahorro */}
        {mostrarAhorro && (
          <div className="text-sm font-medium text-green-600">
            ¡Ahorras {formatearPrecio(ahorro)}!
          </div>
        )}
      </div>
    </div>
  );
};