'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Recipe {
  id: string | number;
  titulo: string;
  tiempo: string;
  dificultad: string;
  categoria: string;
  imagen?: string;
}

export default function RecipeCardClient({ recipe }: { recipe: Recipe }) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const recipeIdStr = String(recipe.id);

  // Consulta la BD para saber si esta receta realmente está en favoritos
  useEffect(() => {
    let isMounted = true;

    const checkIsFavorite = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (isMounted) setIsFav(false);
        return;
      }

      const { data } = await supabase
        .from('favoritos')
        .select('id')
        .eq('usuario_id', session.user.id)
        .eq('receta_id', recipeIdStr);

      if (isMounted) {
        setIsFav(!!(data && data.length > 0));
      }
    };

    checkIsFavorite();

    return () => { isMounted = false; };
  }, [recipeIdStr]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        alert("Debes iniciar sesión para guardar favoritos.");
        setLoading(false);
        return;
      }

      if (isFav) {
        // Eliminar de Supabase
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_id', session.user.id)
          .eq('receta_id', recipeIdStr);

        if (!error) {
          setIsFav(false);
        }
      } else {
        // Guardar en Supabase
        const { error } = await supabase
          .from('favoritos')
          .insert([{ 
            usuario_id: session.user.id, 
            receta_id: recipeIdStr 
          }]);

        if (!error) {
          setIsFav(true);
        }
      }
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
    } finally {
      setLoading(false);
    }
  };

  const bgImagen = recipe.imagen || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between h-72">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImagen}
          alt={recipe.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </div>

      <div className="relative z-20 p-5 flex justify-end">
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={loading}
          className="p-2 rounded-full bg-white/25 backdrop-blur-md hover:bg-white/40 transition-transform active:scale-90 text-white disabled:opacity-50"
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      <Link href={`/recetas/${recipe.id}`} className="relative z-10 p-6 space-y-3 block">
        <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {recipe.categoria}
        </span>
        
        <h3 className="text-xl font-black text-white leading-snug group-hover:text-orange-400 transition-colors">
          {recipe.titulo}
        </h3>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-200 pt-2 border-t border-white/10">
          <span>⏱️ {recipe.tiempo}</span>
          <span>📊 {recipe.dificultad}</span>
        </div>
      </Link>
    </div>
  );
}