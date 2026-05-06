import Link from "next/link";
import styles from "./page.module.css";
import { CATEGORIAS } from "@/lib/supabase";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ═══ Hero Section ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className="section-badge">✨ Artesanía con alma</div>
            <h1 className={styles.heroTitle}>
              Creaciones Únicas
              <br />
              <span className={styles.gradientText}>Hechas a Mano</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Descubre nuestra colección de fieltro artesanal, bisutería exclusiva y aceites esenciales. 
              Cada pieza es creada con amor para ti.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/catalogo" className="btn-primary">
                Explorar Catálogo
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="#categorias" className="btn-secondary">
                Ver Categorías
              </Link>
            </div>

            {/* Stats */}
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>100+</span>
                <span className={styles.statLabel}>Productos</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNumber}>Hecho</span>
                <span className={styles.statLabel}>A Mano 🧵</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNumber}>Envíos</span>
                <span className={styles.statLabel}>A Todo México 📦</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.orbGroup}>
              <div className={`${styles.orb} ${styles.orbPink}`} />
              <div className={`${styles.orb} ${styles.orbAqua}`} />
              <div className={`${styles.orb} ${styles.orbGold}`} />
            </div>
            <div className={styles.floatingCards}>
              <div className={`${styles.floatCard} ${styles.float1}`}>
                <span>🎄</span>
                <p>Navidad Mágica</p>
              </div>
              <div className={`${styles.floatCard} ${styles.float2}`}>
                <span>💎</span>
                <p>Bisutería Única</p>
              </div>
              <div className={`${styles.floatCard} ${styles.float3}`}>
                <span>🌿</span>
                <p>Aceites Premium</p>
              </div>
              <div className={`${styles.floatCard} ${styles.float4}`}>
                <span>🎃</span>
                <p>Halloween</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Categories Section ═══ */}
      <section id="categorias" className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-badge">🎯 Colecciones</div>
            <h2 className="section-title">
              Explora Nuestras <span className="gradient-text">Categorías</span>
            </h2>
            <p className="section-subtitle">
              Cada categoría está llena de piezas únicas creadas artesanalmente
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {CATEGORIAS.map((cat) => (
              <Link 
                href={`/catalogo?categoria=${cat.value}`} 
                key={cat.value} 
                className={styles.categoryCard}
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <div className={styles.categoryIconBg}>
                  <span className={styles.categoryEmoji}>
                    {cat.label.split(' ')[0]}
                  </span>
                </div>
                <h3>{cat.label.substring(cat.label.indexOf(' ') + 1)}</h3>
                <div className={styles.categoryArrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features Section ═══ */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="section-badge">💖 ¿Por qué elegirnos?</div>
            <h2 className="section-title">
              Artesanía con <span className="gradient-text">Corazón</span>
            </h2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: 'rgba(232, 67, 147, 0.1)', color: '#e84393' }}>
                🧵
              </div>
              <h3>100% Hecho a Mano</h3>
              <p>Cada pieza es creada artesanalmente con los mejores materiales y mucho cariño</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: 'rgba(0, 206, 201, 0.1)', color: '#00cec9' }}>
                ✨
              </div>
              <h3>Diseños Únicos</h3>
              <p>No encontrarás dos piezas iguales. Cada creación tiene su propia personalidad</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: 'rgba(162, 155, 254, 0.1)', color: '#a29bfe' }}>
                📦
              </div>
              <h3>Envío Seguro</h3>
              <p>Empacamos cada producto con cuidado para que llegue perfecto a tu puerta</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{ background: 'rgba(253, 203, 110, 0.1)', color: '#fdcb6e' }}>
                💬
              </div>
              <h3>Atención Personal</h3>
              <p>Te atendemos directamente por WhatsApp para resolver cualquier duda</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Testimonial/About ═══ */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutCard}>
            <div className={styles.aboutContent}>
              <div className="section-badge">🏠 Nuestra Historia</div>
              <h2 className="section-title">Un Suspiro de Creatividad</h2>
              <p>
                Somos un emprendimiento familiar dedicado a crear piezas artesanales 
                que llenan de magia cada rincón de tu hogar. Desde adornos navideños 
                en fieltro hasta bisutería única y aceites esenciales, cada producto 
                refleja nuestra pasión por lo hecho a mano.
              </p>
              <p>
                Creemos que los detalles artesanales cuentan historias y crean 
                recuerdos inolvidables. Por eso ponemos el corazón en cada puntada.
              </p>
              <Link href="/catalogo" className="btn-primary" style={{ marginTop: '16px' }}>
                Conoce Nuestros Productos
              </Link>
            </div>
            <div className={styles.aboutVisual}>
              <div className={styles.aboutEmojis}>
                <span className={styles.emojiFloat} style={{ animationDelay: '0s' }}>🎄</span>
                <span className={styles.emojiFloat} style={{ animationDelay: '0.5s' }}>💎</span>
                <span className={styles.emojiFloat} style={{ animationDelay: '1s' }}>🌿</span>
                <span className={styles.emojiFloat} style={{ animationDelay: '1.5s' }}>🧵</span>
                <span className={styles.emojiFloat} style={{ animationDelay: '2s' }}>🎃</span>
                <span className={styles.emojiFloat} style={{ animationDelay: '2.5s' }}>✨</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
