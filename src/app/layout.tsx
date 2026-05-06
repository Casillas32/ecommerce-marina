import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Un Suspiro Navideño | Fieltro, Bisutería y Más",
  description: "Tienda exclusiva de productos artesanales: fieltro hecho a mano, bisutería, aceites esenciales y más. Decoración para Navidad, Halloween y toda ocasión.",
  keywords: "fieltro, navidad, halloween, bisutería, aceites esenciales, artesanal, hecho a mano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        <AuthProvider>
          <CartProvider>
            <AnimatedBackground />
            <Navbar />
            <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
