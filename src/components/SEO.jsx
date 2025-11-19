import { useEffect } from 'react';

/**
 * Componente SEO para actualizar metadatos dinámicamente sin react-helmet
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción de la página
 * @param {string} props.keywords - Palabras clave separadas por comas
 * @param {string} props.canonical - URL canónica
 * @param {string} props.ogImage - Imagen para Open Graph
 * @param {string} props.type - Tipo de contenido (website, article, product)
 */
export function SEO({
  title = 'Plastyfilm SPA - Film Stretch y Embalaje Industrial',
  description = 'Distribuidor líder de film stretch, embalaje industrial y soluciones de empaque en Chile.',
  keywords = 'film stretch, embalaje industrial, film plástico, stretch film',
  canonical = '',
  ogImage = '/Logo.png',
  type = 'website'
}) {
  useEffect(() => {
    // Actualizar título
    document.title = title;

    // Función helper para actualizar o crear meta tags
    const updateMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.split('"')[1]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.split('"')[1]);
        }
        element.setAttribute(attribute, content);
        document.head.appendChild(element);
      }
    };

    // Actualizar meta tags básicos
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    // Actualizar Open Graph
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
      updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
    }
    updateMetaTag('meta[property="og:url"]', 'content', window.location.href);

    // Actualizar Twitter Cards
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
      updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);
    }

    // Actualizar canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = canonical || window.location.href;
    
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonicalUrl);
      document.head.appendChild(linkCanonical);
    }

    // Limpiar al desmontar (opcional)
    return () => {
      // Puedes decidir si mantener o limpiar los meta tags
    };
  }, [title, description, keywords, canonical, ogImage, type]);

  return null; // Este componente no renderiza nada
}

// Hook personalizado para SEO (alternativa)
export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  type
}) {
  useEffect(() => {
    const originalTitle = document.title;
    
    if (title) document.title = title;
    
    const updateMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.split('"')[1]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.split('"')[1]);
        }
        element.setAttribute(attribute, content);
        document.head.appendChild(element);
      }
    };

    if (description) updateMetaTag('meta[name="description"]', 'content', description);
    if (keywords) updateMetaTag('meta[name="keywords"]', 'content', keywords);
    if (title) {
      updateMetaTag('meta[property="og:title"]', 'content', title);
      updateMetaTag('meta[name="twitter:title"]', 'content', title);
    }
    if (description) {
      updateMetaTag('meta[property="og:description"]', 'content', description);
      updateMetaTag('meta[name="twitter:description"]', 'content', description);
    }
    
    return () => {
      document.title = originalTitle;
    };
  }, [title, description, keywords, canonical, ogImage, type]);
}
