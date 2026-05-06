"use client";

import { Suspense } from "react";
import CatalogoContent from "./CatalogoContent";

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando catálogo...
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  );
}
