'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("lector");

  useEffect(() => {
    async function getSessionAndRole() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", user.id)
          .single();

        if (profile?.rol) {
          setUserRole(profile.rol);
        }
      }
    }

    getSessionAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", session.user.id)
          .single();
        if (profile?.rol) setUserRole(profile.rol);
      } else {
        setUserRole("lector");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole("lector");
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-orange-100/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform">
            🍳
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            Recetas<span className="text-orange-600">App</span>
          </span>
        </Link>

        {/* Enlaces */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive("/") ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
            }`}
          >
            Inicio
          </Link>

          <Link
            href="/recetas"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive("/recetas") ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
            }`}
          >
            Recetas
          </Link>

          <Link
            href="/favoritos"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/favoritos") ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
            }`}
          >
            <span>Favoritos ❤️</span>
          </Link>

          {/* Si el usuario autenticado es chef, mostrar botón de gestión */}
          {user && userRole === "chef" && (
            <Link
              href="/chef/gestionar"
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-all"
            >
              Gestionar Recetas
            </Link>
          )}

          <div className="h-6 w-[1px] bg-gray-200 mx-1" />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 hidden sm:inline bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                👤 {user.email} ({userRole})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all border border-red-200"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/login") ? "bg-orange-600 text-white shadow-md shadow-orange-600/20" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                }`}
              >
                Iniciar Sesión
              </Link>

              <Link
                href="/registro"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20`}
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}