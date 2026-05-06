import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2>¿Lista para embellecer tu hogar? ✨</h2>
              <p>Explora nuestra colección artesanal y encuentra el detalle perfecto</p>
            </div>
            <Link href="/catalogo" className="btn-primary">
              Ver Catálogo Completo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <h2 className={styles.logo}>
            <span className={styles.logoIcon}>✨</span>
            Un Suspiro<span className={styles.logoAccent}>Navideño</span>
          </h2>
          <p className={styles.brandText}>
            Creaciones artesanales únicas en fieltro, bisutería y aceites esenciales. Hechas con amor para darle vida a tus celebraciones y tu día a día.
          </p>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <h3>Tienda</h3>
          <ul>
            <li><Link href="/catalogo">Catálogo Completo</Link></li>
            <li><Link href="/catalogo?categoria=navidad">Navidad</Link></li>
            <li><Link href="/catalogo?categoria=halloween">Halloween</Link></li>
            <li><Link href="/catalogo?categoria=bisuteria">Bisutería</Link></li>
            <li><Link href="/catalogo?categoria=aceites-esenciales">Aceites Esenciales</Link></li>
          </ul>
        </div>

        <div className={styles.footerLinks}>
          <h3>Tu Cuenta</h3>
          <ul>
            <li><Link href="/login">Iniciar Sesión</Link></li>
            <li><Link href="/registro">Registrarse</Link></li>
            <li><Link href="/carrito">Mi Carrito</Link></li>
          </ul>
        </div>

        <div className={styles.footerLinks}>
          <h3>Ayuda</h3>
          <ul>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/envios">Envíos</Link></li>
            <li><Link href="/privacidad">Privacidad</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {currentYear} Un Suspiro Navideño. Hecho con 💖 a mano.</p>
        </div>
      </div>
    </footer>
  );
}
