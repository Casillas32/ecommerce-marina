"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { uploadComprobante } from "@/lib/storage";
import styles from "./checkout.module.css";

// ═══════════════════════════════════════════════════
// CONFIGURA TU INFORMACIÓN BANCARIA AQUÍ
// ═══════════════════════════════════════════════════
const BANK_INFO = {
  banco: "Mercado Pago",
  titular: "Marina Isabel Molina Chavez",
  cuenta: "",
  clabe: "722969010361137555",
  // Puedes agregar más métodos de pago:
  // oxxo: "1234567890",
  // paypal: "tu@email.com",
};
// ═══════════════════════════════════════════════════

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: datos, 2: pago, 3: confirmación
  const [formData, setFormData] = useState({
    nombre: "",
    email: user?.email || "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    notas: "",
  });
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);

  const envio = totalPrice >= 500 ? 0 : 99;
  const total = totalPrice + envio;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setComprobante(file);
    const reader = new FileReader();
    reader.onload = (ev) => setComprobantePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      let comprobante_url = "";

      if (comprobante) {
        const orderId = `order-${Date.now()}`;
        comprobante_url = await uploadComprobante(comprobante, orderId);
      }

      const pedido = {
        usuario_id: user?.id || 'anonimo',
        usuario_nombre: formData.nombre,
        usuario_email: formData.email,
        usuario_telefono: formData.telefono,
        direccion: `${formData.direccion}, ${formData.ciudad}, ${formData.estado} CP: ${formData.codigoPostal}`,
        productos: items,
        total: total,
        estado: 'pendiente',
        comprobante_url,
        notas: formData.notas,
      };

      const { error } = await supabase
        .from('pedidos')
        .insert(pedido);

      if (error) throw error;

      setOrderComplete(true);
      clearCart();
    } catch (err: any) {
      alert("Error al enviar pedido: " + (err.message || "Intenta de nuevo"));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.empty}>
            <span>🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos antes de hacer un pedido</p>
            <Link href="/catalogo" className="btn-primary" style={{ marginTop: '20px' }}>
              Ir al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.successCard}>
            <div className={styles.successIcon}>🎉</div>
            <h2>¡Pedido Enviado!</h2>
            <p>
              Tu pedido ha sido registrado exitosamente. Recibirás una confirmación
              cuando verifiquemos tu pago.
            </p>
            <div className={styles.successActions}>
              <Link href="/catalogo" className="btn-primary">Seguir Comprando</Link>
              <Link href="/" className="btn-secondary">Ir al Inicio</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div className="section-badge">💳 Checkout</div>
          <h1 className="section-title">
            Realizar <span className="gradient-text">Pedido</span>
          </h1>
        </div>

        {/* Steps Indicator */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Datos de Envío</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Pago</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Confirmar</span>
          </div>
        </div>

        <div className={styles.checkoutLayout}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Step 1: Shipping Data */}
            {step === 1 && (
              <div className={styles.stepCard}>
                <h2>📦 Datos de Envío</h2>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="10 dígitos"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      value={formData.codigoPostal}
                      onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>Dirección Completa</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Calle, número, colonia"
                    required
                  />
                </div>
                <div className={styles.formGrid} style={{ marginTop: '20px' }}>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      placeholder="Tu ciudad"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <input
                      type="text"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      placeholder="Tu estado"
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>Notas adicionales (opcional)</label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Instrucciones especiales de entrega..."
                    rows={3}
                  />
                </div>
                <div className={styles.stepActions}>
                  <Link href="/carrito" className="btn-secondary">← Volver al Carrito</Link>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.ciudad || !formData.estado) {
                        alert('Por favor completa todos los campos obligatorios');
                        return;
                      }
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Continuar al Pago →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.stepCard}>
                <h2>💳 Información de Pago</h2>
                <p className={styles.paymentIntro}>
                  Realiza tu pago por transferencia bancaria o depósito a la siguiente cuenta.
                  Una vez que realices el pago, sube tu comprobante para agilizar el proceso.
                </p>

                {/* Bank Info Card */}
                <div className={styles.bankCard}>
                  <div className={styles.bankHeader}>
                    <span className={styles.bankIcon}>🏦</span>
                    <h3>Datos Bancarios para Depósito/Transferencia</h3>
                  </div>

                  <div className={styles.bankDetails}>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>Banco</span>
                      <span className={styles.bankValue}>{BANK_INFO.banco}</span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>Titular</span>
                      <span className={styles.bankValue}>{BANK_INFO.titular}</span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>No. de Cuenta</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValueMono}>{BANK_INFO.cuenta}</span>
                        <button
                          className={styles.copyBtn}
                          onClick={() => handleCopy(BANK_INFO.cuenta, 'cuenta')}
                        >
                          {copied === 'cuenta' ? '✓ Copiado' : '📋 Copiar'}
                        </button>
                      </div>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>CLABE Interbancaria</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValueMono}>{BANK_INFO.clabe}</span>
                        <button
                          className={styles.copyBtn}
                          onClick={() => handleCopy(BANK_INFO.clabe, 'clabe')}
                        >
                          {copied === 'clabe' ? '✓ Copiado' : '📋 Copiar'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bankAmount}>
                    <span>Monto a depositar:</span>
                    <strong>${total.toFixed(2)} MXN</strong>
                  </div>
                </div>

                {/* Instructions */}
                <div className={styles.instructions}>
                  <h4>📋 Instrucciones:</h4>
                  <ol>
                    <li>Realiza la transferencia o depósito por <strong>${total.toFixed(2)} MXN</strong></li>
                    <li>Guarda tu comprobante de pago (foto o screenshot)</li>
                    <li>Sube tu comprobante aquí abajo</li>
                    <li>Confirma tu pedido</li>
                    <li>¡Listo! Te enviaremos tu pedido una vez verificado el pago</li>
                  </ol>
                </div>

                {/* Upload Comprobante */}
                <div className={styles.uploadSection}>
                  <h4>📸 Subir Comprobante de Pago (opcional)</h4>
                  <p className={styles.uploadHint}>
                    Puedes subir el comprobante ahora o enviarlo después por WhatsApp
                  </p>
                  <div className={styles.uploadArea}>
                    {comprobantePreview ? (
                      <div className={styles.comprobantePreview}>
                        <img src={comprobantePreview} alt="Comprobante" />
                        <button onClick={() => { setComprobante(null); setComprobantePreview(null); }}>
                          ✕ Quitar
                        </button>
                      </div>
                    ) : (
                      <label className={styles.uploadLabel}>
                        <span>📤</span>
                        <p>Haz clic para subir comprobante</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleComprobanteChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className={styles.stepActions}>
                  <button className="btn-secondary" onClick={() => setStep(1)}>← Datos de Envío</button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Revisar y Confirmar →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className={styles.stepCard}>
                <h2>✅ Confirmar Pedido</h2>

                <div className={styles.confirmSection}>
                  <h4>📦 Datos de Envío</h4>
                  <div className={styles.confirmData}>
                    <p><strong>{formData.nombre}</strong></p>
                    <p>{formData.email} • {formData.telefono}</p>
                    <p>{formData.direccion}</p>
                    <p>{formData.ciudad}, {formData.estado} CP: {formData.codigoPostal}</p>
                    {formData.notas && <p className={styles.notes}>Notas: {formData.notas}</p>}
                  </div>
                </div>

                <div className={styles.confirmSection}>
                  <h4>🛍️ Productos ({totalItems})</h4>
                  <div className={styles.confirmItems}>
                    {items.map((item) => (
                      <div key={item.producto.id} className={styles.confirmItem}>
                        <span>{item.producto.nombre} × {item.cantidad}</span>
                        <span>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.confirmSection}>
                  <h4>💰 Total</h4>
                  <div className={styles.confirmTotals}>
                    <div className={styles.confirmRow}>
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className={styles.confirmRow}>
                      <span>Envío</span>
                      <span>{envio === 0 ? '¡Gratis! 🎉' : `$${envio.toFixed(2)}`}</span>
                    </div>
                    <div className={`${styles.confirmRow} ${styles.confirmTotal}`}>
                      <span>Total a pagar</span>
                      <span>${total.toFixed(2)} MXN</span>
                    </div>
                  </div>
                </div>

                {comprobante && (
                  <div className={styles.confirmSection}>
                    <h4>📸 Comprobante adjunto</h4>
                    <p className={styles.comprobanteNote}>✅ Se adjuntará al pedido</p>
                  </div>
                )}

                <div className={styles.stepActions}>
                  <button className="btn-secondary" onClick={() => setStep(2)}>← Volver</button>
                  <button
                    className="btn-primary"
                    onClick={handleSubmitOrder}
                    disabled={loading}
                  >
                    {loading ? "Enviando Pedido..." : "🎉 Confirmar Pedido"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3>Resumen</h3>
              <div className={styles.sidebarItems}>
                {items.map((item) => (
                  <div key={item.producto.id} className={styles.sidebarItem}>
                    <div className={styles.sidebarItemImg}>
                      {item.producto.imagen_url ? (
                        <img src={item.producto.imagen_url} alt="" />
                      ) : <span>📷</span>}
                    </div>
                    <div className={styles.sidebarItemInfo}>
                      <span className={styles.sidebarItemName}>{item.producto.nombre}</span>
                      <span className={styles.sidebarItemQty}>× {item.cantidad}</span>
                    </div>
                    <span className={styles.sidebarItemPrice}>
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.sidebarTotals}>
                <div className={styles.sidebarRow}>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className={styles.sidebarRow}>
                  <span>Envío</span>
                  <span>{envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}</span>
                </div>
                <div className={`${styles.sidebarRow} ${styles.sidebarTotal}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)} MXN</span>
                </div>
              </div>
              {totalPrice < 500 && (
                <p className={styles.freeShipHint}>
                  ¡Agrega ${(500 - totalPrice).toFixed(2)} más para envío gratis! 🚚
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
