'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import RecipeCardClient from "@/app/components/RecipeCardClient";

const TODAS_LAS_RECETAS_ESTATICAS: Record<string, any> = {
  "1": { id: "1", titulo: "Encebollado de Pescado", tiempo: "45 min", dificultad: "Media", categoria: "Costa / Sopa", imagen: "https://lacocinadegisele.com/wp-content/uploads/2021/01/encebollado.jpg" },
  "2": { id: "2", titulo: "Hornado", tiempo: "120 min", dificultad: "Avanzada", categoria: "Sierra / Plato Fuerte", imagen: "https://i.pinimg.com/originals/94/78/85/9478858c2b29f96df7f3315c5d8a3ea0.jpg" },
  "3": { id: "3", titulo: "Locro de Papa", tiempo: "40 min", dificultad: "Fácil", categoria: "Sierra / Sopa", imagen: "https://tse4.mm.bing.net/th/id/OIP.HJb9qs_god8u82XOriHw6QHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  "4": { id: "4", titulo: "Seco de Pollo", tiempo: "50 min", dificultad: "Media", categoria: "Costa-Sierra / Plato Fuerte", imagen: "https://tse3.mm.bing.net/th/id/OIP.NSJQEgffv2MJwBoX0BKQkAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  "5": { id: "5", titulo: "Fritada", tiempo: "90 min", dificultad: "Media", categoria: "Sierra / Plato Fuerte", imagen: "https://4.bp.blogspot.com/-pOSJPY2PbLI/VZ3aHx_WVoI/AAAAAAAABds/FBtkAxEsocw/s1600/Fritada.jpg" },
  "6": { id: "6", titulo: "Guatita", tiempo: "60 min", dificultad: "Avanzada", categoria: "Costa-Sierra / Plato Fuerte", imagen: "https://th.bing.com/th/id/R.2f4ae237171af85820916be7c84f1645?rik=EUQ03KPHn9VOpA&pid=ImgRaw&r=0" },
  "7": { id: "7", titulo: "Ceviche de Camarón", tiempo: "30 min", dificultad: "Fácil", categoria: "Costa / Entrada", imagen: "https://vertelenovelas.net/wp-content/uploads/2024/06/ceviche-mixto-ecuatoriano-1024x680.jpg" },
  "8": { id: "8", titulo: "Mote Pillo", tiempo: "25 min", dificultad: "Fácil", categoria: "Sierra / Acompañante", imagen: "https://4.bp.blogspot.com/-Z_T38sMHuGw/TrxQd5qQQuI/AAAAAAAAAHk/r9iTi0eX1NI/s1600/mote-pillo.JPG" },
  "9": { id: "9", titulo: "Bolón de Verde", tiempo: "20 min", dificultad: "Fácil", categoria: "Costa / Desayuno", imagen: "https://th.bing.com/th/id/R.8438d810c19cf927198db3d6e712448e?rik=8qUfFr5wgN4Vhg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-RZvAzGgJ0-w%2fVTUnyf5Wx-I%2fAAAAAAAAABs%2fFZ1qthAgNFQ%2fs1600%2fbolon%252Bde%252Bverde%252Bmixto.jpg&ehk=20clFcW2rYjdacd9bY0y4ca4iOangUWFOj49TcEgw0A%3d&risl=&pid=ImgRaw&r=0" },
  "10": { id: "10", titulo: "Llapingacho", tiempo: "40 min", dificultad: "Media", categoria: "Sierra / Plato Fuerte", imagen: "https://i.pinimg.com/originals/b1/88/90/b18890fbc6b1049141ed83a5f067153a.jpg" },
  "11": { id: "11", titulo: "Chuleta Asada con Arroz y Menestra", tiempo: "35 min", dificultad: "Fácil", categoria: "Costa / Plato Fuerte", imagen: "https://turismo.ecuadors.live/wp-content/uploads/2023/07/Arroz-con-menestra-y-carne.jpg" },
  "12": { id: "12", titulo: "Cazuela de Pescado", tiempo: "50 min", dificultad: "Media", categoria: "Costa / Plato Fuerte", imagen: "https://tse4.mm.bing.net/th/id/OIP.UUQ1daPSXRExKQihmPXtDAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  "13": { id: "13", titulo: "Bollo de Pescado", tiempo: "45 min", dificultad: "Media", categoria: "Costa / Plato Fuerte", imagen: "https://tse4.mm.bing.net/th/id/OIP.s81OwxiH-b4u6EvY6GfrngHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  "14": { id: "14", titulo: "Corviche", tiempo: "30 min", dificultad: "Media", categoria: "Costa / Aperitivo", imagen: "https://tse1.mm.bing.net/th/id/OIP.mU07CHA8xT0Cmsa7dDldDAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  "15": { id: "15", titulo: "Sopa de Pollo", tiempo: "40 min", dificultad: "Fácil", categoria: "Sopa", imagen: "https://recetacubana.com/wp-content/uploads/2018/02/receta-sopa-de-pollo.jpg" },
  "16": { id: "16", titulo: "Carne Apanada con Arroz y Puré", tiempo: "30 min", dificultad: "Fácil", categoria: "Plato Fuerte", imagen: "https://recetaskwa.com/wp-content/uploads/2024/02/Arroz_pure_1.jpg" },
  "17": { id: "17", titulo: "Seco de Chivo", tiempo: "90 min", dificultad: "Avanzada", categoria: "Plato Fuerte", imagen: "https://1.bp.blogspot.com/-fKDOqo_EsdE/X4chMexCADI/AAAAAAAAYNw/J6wEv7ICHJcz3H3a7bGlp95Tu4IN8XO9QCLcBGAsYHQ/s16000/gastronomia-tipica-de-ecuador-seco-de-chivo.jpg" },
  "18": { id: "18", titulo: "Pescado Frito con Patacones", tiempo: "35 min", dificultad: "Fácil", categoria: "Costa / Plato Fuerte", imagen: "https://i.pinimg.com/originals/c5/8e/25/c58e259a1d1a03dc240abd3e6f5b10a6.jpg" },
  "19": { id: "19", titulo: "Muchines de Yuca", tiempo: "30 min", dificultad: "Media", categoria: "Costa / Aperitivo", imagen: "https://recetasyuca.com/wp-content/uploads/2023/04/Muchines-de-Yuca-Receta.webp" },
  "20": { id: "20", titulo: "Caldo de Bola de Verde", tiempo: "70 min", dificultad: "Avanzada", categoria: "Costa / Sopa", imagen: "https://gimmeyummy.com/wp-content/uploads/2020/07/easy-caldo-de-bolas-de-verde-e1606031818641.jpg" },
  "21": { id: "21", titulo: "Pasta al limón cremosa", tiempo: "15 min", dificultad: "Fácil", categoria: "Italia / Pasta", imagen: "https://sabordelobueno.com/wp-content/uploads/2023/05/pasta-al-limon-portada.jpg" },
  "22": { id: "22", titulo: "Tacos de pollo", tiempo: "20 min", dificultad: "Fácil", categoria: "México / Plato Fuerte", imagen: "https://assets.unileversolutions.com/recipes-v2/234572.jpg" },
  "23": { id: "23", titulo: "Ají de gallina", tiempo: "30 min", dificultad: "Media", categoria: "Perú / Plato Fuerte", imagen: "https://i.pinimg.com/originals/3e/8b/6d/3e8b6de0e204e025e4d5fcb8ecdfd9e5.jpg" },
  "24": { id: "24", titulo: "Pollo teriyaki", tiempo: "20 min", dificultad: "Fácil", categoria: "Japón / Plato Fuerte", imagen: "https://tse3.mm.bing.net/th/id/OIP.dGcE_ZBuUUC1QNlHuo3_hAHaE_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  "25": { id: "25", titulo: "Curry suave", tiempo: "25 min", dificultad: "Fácil", categoria: "India / Plato Fuerte", imagen: "https://recetasepicas.com/wp-content/uploads/2025/09/Pollo-al-curry-suave-2-683x1024.jpg" },
  "26": { id: "26", titulo: "Quiche", tiempo: "45 min", dificultad: "Media", categoria: "Francia / Plato Fuerte", imagen: "https://natashaskitchen.com/wp-content/uploads/2019/11/Classic-Quiche-Lorraine-Recipe-Beautiful-flaky-pastry-crust-is-paired-with-a-delicious-savory-egg-custard.-Perfect-for-breakfast-or-brunch.-1-4.jpg" },
  "27": { id: "27", titulo: "Empanadas clásicas", tiempo: "40 min", dificultad: "Media", categoria: "Argentina / Aperitivo", imagen: "https://media.losandes.com.ar/p/7ab8e044e8850ac7f9494ab077b369fd/adjuntos/368/imagenes/100/064/0100064083/1200x675/smart/receta-facil-como-hacer-las-clasicas-empanadas-argentinas-carne-del-reconocido-chef-gaston-riveira-imagen-ilustrativa-web.jpg" },
};

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      // 1. Obtener directamente las filas guardadas en la tabla
      const { data: favData } = await supabase
        .from('favoritos')
        .select('*');

      if (!favData || favData.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Extraer array de IDs limpios
      const favIds = favData.map((f: any) => String(f.receta_id));

      // 2. Traer recetas dinámicas de Supabase en caso de existir
      const { data: recetasDB } = await supabase
        .from('recipes')
        .select('*')
        .in('id', favIds);

      const dbMap: Record<string, any> = {};
      if (recetasDB) {
        recetasDB.forEach((r: any) => {
          dbMap[String(r.id)] = {
            id: String(r.id),
            titulo: r.titulo,
            tiempo: "30 min",
            dificultad: "Fácil",
            categoria: "Receta de la Comunidad",
            imagen: r.imagen
          };
        });
      }

      // 3. Mapear cada registro guardado a la receta correspondiente
      const listaFinal = favIds
        .map((id) => TODAS_LAS_RECETAS_ESTATICAS[id] || dbMap[id])
        .filter(Boolean);

      setFavorites(listaFinal);
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Mis Recetas Favoritas ❤️</h1>
        <p className="text-gray-600 mt-1">Aquí encontrarás todas tus recetas favoritas sincronizadas con la base de datos.</p>
      </div>

      {loading ? (
        <p className="text-gray-500 font-medium">Cargando tus favoritos...</p>
      ) : favorites.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-xl mx-auto space-y-4">
          <span className="text-6xl">🍲</span>
          <h3 className="text-xl font-bold text-gray-800">Aún no tienes favoritos</h3>
          <p className="text-gray-500 text-sm">Explora el catálogo de recetas y haz clic en el icono de corazón (❤️) de cualquier tarjeta para guardarla en tu base de datos.</p>
          <div>
            <Link
              href="/recetas"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-2xl transition-colors shadow-lg mt-2"
            >
              Explorar Recetas
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((receta) => (
            <RecipeCardClient key={receta.id} recipe={receta} />
          ))}
        </div>
      )}
    </div>
  );
}