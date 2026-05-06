"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, Producto, CATEGORIAS } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import styles from "./catalogo.module.css";

export default function CatalogoContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaParam || "todos");
  const [busqueda, setBusqueda] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (categoriaParam) {
      setCategoriaActiva(categoriaParam);
    }
  }, [categoriaParam]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("activo", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error("Error fetching productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const matchCategoria = categoriaActiva === "todos" || p.categoria === categoriaActiva;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const handleAddToCart = (producto: Producto) => {
    addToCart(producto, 1);
    setAddedId(producto.id || null);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className="section-badge">🛍️ Tienda</div>
          <h1 className="section-title">
            Nuestro <span className="gradient-text">Catálogo</span>
          </h1>
          <p className="section-subtitle">
            Encuentra la pieza artesanal perfecta para ti
          </p>
        </div>

        {/* Search & Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className={styles.categoryTabs}>
            <button
              className={`${styles.tab} ${categoriaActiva === "todos" ? styles.tabActive : ""}`}
              onClick={() => setCategoriaActiva("todos")}
            >
              Todos
            </button>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                className={`${styles.tab} ${categoriaActiva === cat.value ? styles.tabActive : ""}`}
                onClick={() => setCategoriaActiva(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otra categoría o término de búsqueda</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <span>📷</span>
                    </div>
                  )}
                  {producto.stock <= 3 && producto.stock > 0 && (
                    <span className={styles.stockBadge}>¡Últimas {producto.stock}!</span>
                  )}
                  {producto.stock === 0 && (
                    <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Agotado</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>
                    {CATEGORIAS.find(c => c.value === producto.categoria)?.label || producto.categoria}
                  </span>
                  <h3 className={styles.productName}>{producto.nombre}</h3>
                  <p className={styles.productDesc}>{producto.descripcion}</p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>
                      ${producto.precio.toFixed(2)} <small>MXN</small>
                    </span>
                    <button
                      className={`${styles.addBtn} ${addedId === producto.id ? styles.added : ''}`}
                      onClick={() => handleAddToCart(producto)}
                      disabled={producto.stock === 0}
                    >
                      {addedId === producto.id ? (
                        <>✓ Agregado</>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                          Agregar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
