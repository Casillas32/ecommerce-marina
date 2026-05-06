"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase, Producto, CATEGORIAS } from "@/lib/supabase";
import { uploadImage, validateImageFile, deleteImage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "navidad",
    stock: "10",
    activo: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) fetchProductos();
  }, [user]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "navidad",
      stock: "10",
      activo: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (producto: Producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      categoria: producto.categoria,
      stock: producto.stock.toString(),
      activo: producto.activo,
    });
    setImagePreview(producto.imagen_url || null);
    setEditingId(producto.id || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showMessage('error', validationError);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Iniciando guardado...", form);
    setSaving(true);

    try {
      let imagen_url = editingId 
        ? productos.find(p => p.id === editingId)?.imagen_url || "" 
        : "";

      // Upload image if new file selected
      if (imageFile) {
        console.log("📸 Subiendo imagen a Supabase...");
        setUploading(true);
        try {
          imagen_url = await uploadImage(imageFile, form.categoria);
          console.log("✅ Imagen subida:", imagen_url);
        } catch (err: any) {
          console.error("❌ Error en Storage:", err);
          alert("Error al subir imagen: " + err.message);
          setSaving(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const productoData = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        categoria: form.categoria,
        imagen_url,
        stock: parseInt(form.stock),
        activo: form.activo,
      };

      console.log("💾 Insertando en base de datos...", productoData);

      if (editingId) {
        const { error } = await supabase
          .from("productos")
          .update(productoData)
          .eq("id", editingId);

        if (error) throw error;
        alert("✅ Producto actualizado!");
      } else {
        const { error } = await supabase
          .from("productos")
          .insert(productoData);

        if (error) {
          console.error("❌ Error de Supabase:", error);
          throw error;
        }
        alert("✅ Producto agregado con éxito!");
      }

      resetForm();
      fetchProductos();
    } catch (err: any) {
      console.error("❌ Error final:", err);
      alert("Error crítico: " + (err.message || "Error desconocido"));
      showMessage('error', err.message || "Error al guardar producto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (producto: Producto) => {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;

    try {
      // Delete image from storage
      if (producto.imagen_url) {
        try { await deleteImage(producto.imagen_url); } catch {}
      }

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", producto.id);

      if (error) throw error;
      showMessage('success', '🗑️ Producto eliminado');
      fetchProductos();
    } catch (err: any) {
      showMessage('error', err.message || "Error al eliminar");
    }
  };

  const toggleActivo = async (producto: Producto) => {
    try {
      const { error } = await supabase
        .from("productos")
        .update({ activo: !producto.activo })
        .eq("id", producto.id);

      if (error) throw error;
      fetchProductos();
    } catch (err: any) {
      showMessage('error', "Error al actualizar estado");
    }
  };

  if (authLoading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loadingState}>Cargando...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.accessDenied}>
            <span>🔒</span>
            <h2>Acceso Restringido</h2>
            <p>Solo los administradores pueden acceder a esta sección.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Message Toast */}
        {message && (
          <div className={`toast ${message.type}`}>{message.text}</div>
        )}

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className="section-badge">⚙️ Administración</div>
            <h1 className="section-title">Panel de <span className="gradient-text">Productos</span></h1>
          </div>
          <button
            className="btn-primary"
            onClick={() => { resetForm(); setShowForm(!showForm); }}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo Producto"}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className={styles.formCard}>
            <h2>{editingId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Esfera Navideña de Fieltro"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    {CATEGORIAS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Precio (MXN)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Describe tu producto..."
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className={styles.imageUpload}>
                <label>Imagen del Producto</label>
                <div 
                  className={styles.dropZone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className={styles.previewContainer}>
                      <img src={imagePreview} alt="Preview" className={styles.preview} />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.dropContent}>
                      <span className={styles.dropIcon}>📷</span>
                      <p>Haz clic para subir una imagen</p>
                      <small>JPG, PNG, WebP o GIF • Máx. 5MB</small>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Active toggle */}
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                <span className={styles.toggleSwitch} />
                Producto activo (visible en la tienda)
              </label>

              <div className={styles.formActions}>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {uploading ? "Subiendo imagen..." : saving ? "Guardando..." : editingId ? "Actualizar Producto" : "Agregar Producto"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className={styles.productsList}>
          <div className={styles.listHeader}>
            <h3>{productos.length} productos</h3>
          </div>

          {loading ? (
            <div className={styles.loadingState}>Cargando productos...</div>
          ) : productos.length === 0 ? (
            <div className={styles.emptyState}>
              <span>📦</span>
              <p>No hay productos aún. ¡Agrega el primero!</p>
            </div>
          ) : (
            <div className={styles.listGrid}>
              {productos.map((producto) => (
                <div key={producto.id} className={`${styles.listItem} ${!producto.activo ? styles.inactive : ''}`}>
                  <div className={styles.listImage}>
                    {producto.imagen_url ? (
                      <img src={producto.imagen_url} alt={producto.nombre} />
                    ) : (
                      <div className={styles.listNoImage}>📷</div>
                    )}
                  </div>
                  <div className={styles.listInfo}>
                    <h4>{producto.nombre}</h4>
                    <div className={styles.listMeta}>
                      <span className={styles.listCategory}>
                        {CATEGORIAS.find(c => c.value === producto.categoria)?.label || producto.categoria}
                      </span>
                      <span className={styles.listPrice}>${producto.precio.toFixed(2)}</span>
                      <span className={styles.listStock}>Stock: {producto.stock}</span>
                    </div>
                  </div>
                  <div className={styles.listActions}>
                    <button
                      onClick={() => toggleActivo(producto)}
                      className={`${styles.statusToggle} ${producto.activo ? styles.active : ''}`}
                      title={producto.activo ? 'Desactivar' : 'Activar'}
                    >
                      {producto.activo ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button onClick={() => handleEdit(producto)} className={styles.editBtn} title="Editar">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(producto)} className={styles.deleteBtn} title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
