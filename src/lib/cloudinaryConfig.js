// Configuración de Cloudinary

const cloudName = import.meta.env.VITE_CLOUD_NAME;
export const CLOUDINARY_CONFIG = {
  
  cloudName: cloudName,
  
 
  uploadPreset: 'embalaje-plasty',
  

  baseUrl: 'https://api.cloudinary.com/v1_1',
};
