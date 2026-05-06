"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CATEGORIAS } from "@/lib/supabase";
import styles from "./carrito.module.css";

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>¡Explora nuestro catálogo y encuentra algo especial!</p>
            <Link href="/catalogo" className="btn-primary" style={{ marginTop: '24px' }}>
              Ir al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div className="section-badge">🛒 Carrito</div>
          <h1 className="section-title">
            Tu <span className="gradient-text">Carrito</span>
          </h1>
          <p className="section-subtitle">{totalItems} artículo{totalItems !== 1 ? 's' : ''} en tu carrito</p>
        </div>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.producto.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.producto.imagen_url ? (
                    <img src={item.producto.imagen_url} alt={item.producto.nombre} />
                  ) : (
                    <div className={styles.noImage}>📷</div>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCategory}>
                    {CATEGORIAS.find(c => c.value === item.producto.categoria)?.label}
                  </span>
                  <h3>{item.producto.nombre}</h3>
                  <span className={styles.itemPrice}>
                    ${item.producto.precio.toFixed(2)} MXN
                  </span>
                </div>
                <div className={styles.itemControls}>
                  <div className={styles.quantity}>
                    <button onClick={() => updateQuantity(item.producto.id!, item.cantidad - 1)}>−</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.producto.id!, item.cantidad + 1)}>+</button>
                  </div>
                  <span className={styles.itemTotal}>
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.producto.id!)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>Resumen del Pedido</h3>
              <div className={styles.summaryRow}>
                <span>Subtotal ({totalItems} artículos)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span className={styles.shippingNote}>Por calcular</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)} MXN</span>
              </div>
              <Link href="/checkout" className={`btn-primary ${styles.checkoutBtn}`}>
                Realizar Pedido
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/catalogo" className={styles.continueShopping}>
                ← Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
