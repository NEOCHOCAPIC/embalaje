import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

// Obtener ofertas activas
export const getActiveOffers = async () => {
  try {
    const now = new Date();
    const ofertasQuery = query(
      collection(db, 'ofertas'),
      where('activa', '==', true)
    );
    
    const ofertasSnapshot = await getDocs(ofertasQuery);
    const ofertas = ofertasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaInicio: doc.data().fechaInicio?.toDate(),
      fechaFin: doc.data().fechaFin?.toDate(),
    }));

    // Filtrar ofertas vigentes por fecha
    return ofertas.filter(oferta => {
      const inicio = oferta.fechaInicio;
      const fin = oferta.fechaFin;
      
      if (!inicio) return false;
      if (inicio > now) return false;
      if (fin && fin < now) return false;
      return true;
    });
  } catch (error) {
    console.error('Error obteniendo ofertas:', error);
    return [];
  }
};

// Verificar si un producto específico tiene oferta
export const getProductOffer = (producto, ofertas) => {
  if (!producto || !ofertas.length) return null;

  // Buscar oferta específica para el producto (múltiples productos o único)
  const ofertaProducto = ofertas.find(oferta => {
    if (oferta.tipoOferta !== 'producto') return false;
    
    // Verificar si el producto está en la lista de productos de la oferta
    const productosIds = oferta.productosIds || (oferta.productoId ? [oferta.productoId] : []);
    return productosIds.includes(producto.id);
  });
  if (ofertaProducto) return ofertaProducto;

  // Buscar oferta por subcategoría
  const ofertaSubcategoria = ofertas.find(
    oferta => 
      oferta.tipoOferta === 'subcategoria' &&
      oferta.categoriaId === producto.categoria &&
      oferta.subcategoriaId === producto.subcategoria
  );
  if (ofertaSubcategoria) return ofertaSubcategoria;

  // Buscar oferta por categoría
  const ofertaCategoria = ofertas.find(
    oferta =>
      oferta.tipoOferta === 'categoria' &&
      oferta.categoriaId === producto.categoria
  );
  if (ofertaCategoria) return ofertaCategoria;

  return null;
};

// Calcular precio con descuento
export const calcularPrecioConDescuento = (precio, descuentoPorcentaje) => {
  return precio * (1 - descuentoPorcentaje / 100);
};

// Formatear precio en pesos chilenos
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);
};

// Hook personalizado para usar ofertas en componentes
export const useOffers = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const activeOffers = await getActiveOffers();
        setOfertas(activeOffers);
      } catch (error) {
        console.error('Error cargando ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  return { ofertas, loading };
};