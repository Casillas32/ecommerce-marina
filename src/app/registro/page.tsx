"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Crear el usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre }
        }
      });

      if (authError) throw authError;

      // 2. Guardar el perfil del usuario en la tabla usuarios
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nombre,
          email,
          rol: 'cliente',
        });
      }

      // 3. Redirigir
      router.push("/catalogo");
    } catch (err: any) {
      if (err.message?.includes("already registered")) {
        setError("Este correo electrónico ya está registrado.");
      } else if (err.message?.includes("password")) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(err.message || "Error al registrar. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <div className={styles.authIcon}>🎉</div>
          <h1>Crea tu Cuenta</h1>
          <p>Únete a Un Suspiro Navideño y empieza a comprar</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleRegister} className={styles.authForm}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
