import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const isMissingCredentials = supabaseUrl === 'https://placeholder.supabase.co';

if (isMissingCredentials && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase URL o Anon Key no configuradas. ' +
    'Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY a tu .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  stock: number;
  activo: boolean;
  created_at?: string;
}

export interface Pedido {
  id?: string;
  usuario_id: string;
  usuario_nombre: string;
  usuario_email: string;
  usuario_telefono: string;
  direccion: string;
  productos: CartItem[];
  total: number;
  estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado';
  comprobante_url?: string;
  created_at?: string;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export const CATEGORIAS = [
  { value: 'navidad', label: '🎄 Navidad', color: '#e74c3c' },
  { value: 'halloween', label: '🎃 Halloween', color: '#f39c12' },
  { value: 'bisuteria', label: '💎 Bisutería', color: '#9b59b6' },
  { value: 'aceites-esenciales', label: '🌿 Aceites Esenciales', color: '#27ae60' },
  { value: 'fieltro', label: '🧵 Fieltro Artesanal', color: '#e91e63' },
  { value: 'decoracion', label: '✨ Decoración', color: '#00bcd4' },
  { value: 'regalos', label: '🎁 Regalos', color: '#ff5722' },
  { value: 'otros', label: '📦 Otros', color: '#607d8b' },
] as const;

export type CategoriaValue = typeof CATEGORIAS[number]['value'];
