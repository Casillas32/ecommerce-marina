"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, loading, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobile}>
          <span className={styles.logoIcon}>✨</span>
          Un Suspiro<span className={styles.logoAccent}>Navideño</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/catalogo?categoria=navidad">Navidad</Link>
          <Link href="/catalogo?categoria=halloween">Halloween</Link>
          <Link href="/catalogo?categoria=bisuteria">Bisutería</Link>
          <Link href="/catalogo?categoria=aceites-esenciales">Aceites</Link>
        </div>

        {/* Actions */}
        <div className={styles.navActions}>
          {/* Admin Link */}
          {isAdmin && (
            <Link href="/admin" className={styles.adminBtn} title="Panel Admin">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
              </svg>
            </Link>
          )}

          {/* User */}
          {!loading && user ? (
            <div className={styles.userMenu}>
              <span className={styles.userAvatar}>
                {user.email?.charAt(0).toUpperCase()}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>Salir</button>
            </div>
          ) : (
            <Link href="/login" className={styles.iconBtn} aria-label="Mi Cuenta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link href="/carrito" className={styles.cartBtn} aria-label="Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href="/catalogo" onClick={closeMobile}>Catálogo Completo</Link>
        <Link href="/catalogo?categoria=navidad" onClick={closeMobile}>🎄 Navidad</Link>
        <Link href="/catalogo?categoria=halloween" onClick={closeMobile}>🎃 Halloween</Link>
        <Link href="/catalogo?categoria=bisuteria" onClick={closeMobile}>💎 Bisutería</Link>
        <Link href="/catalogo?categoria=aceites-esenciales" onClick={closeMobile}>🌿 Aceites Esenciales</Link>
        {isAdmin && <Link href="/admin" onClick={closeMobile}>⚙️ Panel Admin</Link>}
        {!loading && !user && (
          <Link href="/login" onClick={closeMobile} className={styles.mobileLoginBtn}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
