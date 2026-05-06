"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("🔐 Inicializando Auth...");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error("❌ Error recuperando sesión:", error);
      
      if (session) {
        console.log("✅ Sesión encontrada:", session.user.email);
        setUser(session.user);
        checkAdmin(session.user.id);
      } else {
        console.log("ℹ️ No hay sesión activa.");
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Cambio de Auth:", event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn("⚠️ No se pudo obtener el rol del usuario:", error.message);
        setIsAdmin(false);
      } else {
        console.log("👑 Rol detectado:", data?.rol);
        setIsAdmin(data?.rol === 'admin');
      }
    } catch (err) {
      console.error("❌ Error crítico en checkAdmin:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
