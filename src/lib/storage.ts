import { supabase } from './supabase';

const BUCKET_NAME = 'productos';

/**
 * Sube una imagen al bucket de Supabase Storage.
 * Retorna la URL pública de la imagen.
 */
export async function uploadImage(file: File, folder: string = 'productos'): Promise<string> {
  // Crear nombre único para el archivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  // Obtener la URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Sube un comprobante de pago
 */
export async function uploadComprobante(file: File, pedidoId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `comprobantes/${pedidoId}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir comprobante: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Elimina una imagen del bucket
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  // Extraer el path del archivo desde la URL
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
  if (pathParts.length < 2) return;

  const filePath = pathParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw new Error(`Error al eliminar imagen: ${error.message}`);
  }
}

/**
 * Valida un archivo antes de subirlo
 */
export function validateImageFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return 'Formato no soportado. Usa JPG, PNG, WebP o GIF.';
  }

  if (file.size > maxSize) {
    return 'La imagen es demasiado grande. Máximo 5MB.';
  }

  return null;
}
