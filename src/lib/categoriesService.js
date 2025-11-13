import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { defaultCategories } from './categories';

/**
 * Inicializa las categorías en Firestore si no existen
 * Se debe ejecutar una vez al iniciar la aplicación (en AuthProvider o similar)
 */


/**
 * Obtiene todas las categorías de Firestore
 */
export const getCategorias = async () => {
  try {
    const categoriasRef = collection(db, 'categorias');
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
    return defaultCategories;
  }
};

/**
 * Obtiene una categoría específica por su ID
 */
export const getCategoria = async (categoriaId) => {
  try {
    const categoriasRef = collection(db, 'categorias');
    const q = query(categoriasRef, where('id', '==', categoriaId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        docId: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    return null;
  }
};
