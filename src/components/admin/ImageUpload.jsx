import { useState } from 'react';
import { CLOUDINARY_CONFIG } from '../../lib/cloudinaryConfig';

const ImageUpload = ({ onImageUpload, currentImage = null, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('La imagen no puede ser mayor a 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

      const response = await fetch(
        `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      
      onImageUpload(data.secure_url);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del Producto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || disabled}
            className="block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Preview de la imagen actual */}
      {currentImage && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista previa:
          </label>
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg'; 
              }}
            />
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {uploading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Subiendo imagen...</span>
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {uploadError}
        </div>
      )}

      {/* Instrucciones */}
      <div className="text-xs text-gray-500">
        <p>• Formatos soportados: JPG, PNG, GIF, WebP</p>
        <p>• Tamaño máximo: 10MB</p>
        <p>• Recomendado: 800x800px para mejor calidad</p>
      </div>
    </div>
  );
};

export default ImageUpload;