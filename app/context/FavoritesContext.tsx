"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Recipe {
  id: string;
  titulo: string;
  tiempo: string;
  dificultad: string;
  categoria: string;
  imagen?: string; // Agregado para soportar la imagen
}

interface FavoritesContextType {
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // 1. Al cargar la app, leemos los favoritos guardados en el localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("recetas_favoritas");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    }
  }, []);

  // 2. Cada vez que cambien los favoritos, los guardamos en el localStorage
  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === recipe.id);
      let updatedFavorites;
      if (exists) {
        updatedFavorites = prev.filter((item) => item.id !== recipe.id);
      } else {
        updatedFavorites = [...prev, recipe];
      }
      
      // Guardar en localStorage
      localStorage.setItem("recetas_favoritas", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  }
  return context;
}