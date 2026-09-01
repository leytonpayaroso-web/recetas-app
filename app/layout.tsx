import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { FavoritesProvider } from "@/app/context/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RecetasApp - Delicias Culinarias",
  description: "Aplicación de recetas con Next.js y Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-br from-orange-50 via-amber-50/30 to-stone-100 min-h-screen text-gray-900 antialiased`}>
        <FavoritesProvider>
          <Navbar />
          <main className="pb-16">{children}</main>
        </FavoritesProvider>
      </body>
    </html>
  );
}