import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Inicializa las categorías en Firestore si no existen
 * Se debe ejecutar una vez al iniciar la aplicación (en AuthProvider o similar)
 */


/**
 * Obtiene todas las categorías de Firestore
 */
export const getProductos = async () => {
  try {
    const categoriasRef = collection(db, 'productos');
    const q = query(categoriasRef);
    const snapshot = await getDocs(q);
    
    const categorias = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Ordenar por el campo 'order'
    return categorias.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
  }
};

export const getProductoById = async (id) => {
  try {
    const productoRef = doc(db, 'productos', id);
    const productoSnapshot = await getDoc(productoRef);

    if (productoSnapshot.exists()) {
      return { id: productoSnapshot.id, ...productoSnapshot.data() };
    } else {
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    throw error;
  }
};

