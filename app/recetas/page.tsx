import RecipeCardClient from "@/app/components/RecipeCardClient";
import { createClient } from "@supabase/supabase-js";

// Instancia de Supabase para lectura de datos en Server Components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// 1. Diccionario con imágenes específicas para cada receta local por su ID (del 1 al 20)
const imagenesLocales: Record<string, string> = {
  "1": "https://lacocinadegisele.com/wp-content/uploads/2021/01/encebollado.jpg",
  "2": "https://i.pinimg.com/originals/94/78/85/9478858c2b29f96df7f3315c5d8a3ea0.jpg",
  "3": "https://tse4.mm.bing.net/th/id/OIP.HJb9qs_god8u82XOriHw6QHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "4": "https://tse3.mm.bing.net/th/id/OIP.NSJQEgffv2MJwBoX0BKQkAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "5": "https://4.bp.blogspot.com/-pOSJPY2PbLI/VZ3aHx_WVoI/AAAAAAAABds/FBtkAxEsocw/s1600/Fritada.jpg",
  "6": "https://th.bing.com/th/id/R.2f4ae237171af85820916be7c84f1645?rik=EUQ03KPHn9VOpA&pid=ImgRaw&r=0",
  "7": "https://vertelenovelas.net/wp-content/uploads/2024/06/ceviche-mixto-ecuatoriano-1024x680.jpg",
  "8": "https://4.bp.blogspot.com/-Z_T38sMHuGw/TrxQd5qQQuI/AAAAAAAAAHk/r9iTi0eX1NI/s1600/mote-pillo.JPG",
  "9": "https://th.bing.com/th/id/R.8438d810c19cf927198db3d6e712448e?rik=8qUfFr5wgN4Vhg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-RZvAzGgJ0-w%2fVTUnyf5Wx-I%2fAAAAAAAAABs%2fFZ1qthAgNFQ%2fs1600%2fbolon%252Bde%252Bverde%252Bmixto.jpg&ehk=20clFcW2rYjdacd9bY0y4ca4iOangUWFOj49TcEgw0A%3d&risl=&pid=ImgRaw&r=0",
  "10": "https://i.pinimg.com/originals/b1/88/90/b18890fbc6b1049141ed83a5f067153a.jpg",
  "11": "https://turismo.ecuadors.live/wp-content/uploads/2023/07/Arroz-con-menestra-y-carne.jpg",
  "12": "https://tse4.mm.bing.net/th/id/OIP.UUQ1daPSXRExKQihmPXtDAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "13": "https://tse4.mm.bing.net/th/id/OIP.s81OwxiH-b4u6EvY6GfrngHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "14": "https://tse1.mm.bing.net/th/id/OIP.mU07CHA8xT0Cmsa7dDldDAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "15": "https://recetacubana.com/wp-content/uploads/2018/02/receta-sopa-de-pollo.jpg",
  "16": "https://recetaskwa.com/wp-content/uploads/2024/02/Arroz_pure_1.jpg",
  "17": "https://1.bp.blogspot.com/-fKDOqo_EsdE/X4chMexCADI/AAAAAAAAYNw/J6wEv7ICHJcz3H3a7bGlp95Tu4IN8XO9QCLcBGAsYHQ/s16000/gastronomia-tipica-de-ecuador-seco-de-chivo.jpg",
  "18": "https://i.pinimg.com/originals/c5/8e/25/c58e259a1d1a03dc240abd3e6f5b10a6.jpg",
  "19": "https://recetasyuca.com/wp-content/uploads/2023/04/Muchines-de-Yuca-Receta.webp",
  "20": "https://gimmeyummy.com/wp-content/uploads/2020/07/easy-caldo-de-bolas-de-verde-e1606031818641.jpg",
};

// 2. Diccionario con imágenes para tus 7 nuevas recetas internacionales (del 21 al 27)
const imagenesInternacionales: Record<string, string> = {
  "21": "https://sabordelobueno.com/wp-content/uploads/2023/05/pasta-al-limon-portada.jpg",
  "22": "https://assets.unileversolutions.com/recipes-v2/234572.jpg",
  "23": "https://i.pinimg.com/originals/3e/8b/6d/3e8b6de0e204e025e4d5fcb8ecdfd9e5.jpg",
  "24": "https://tse3.mm.bing.net/th/id/OIP.dGcE_ZBuUUC1QNlHuo3_hAHaE_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  "25": "https://recetasepicas.com/wp-content/uploads/2025/09/Pollo-al-curry-suave-2-683x1024.jpg",
  "26": "https://natashaskitchen.com/wp-content/uploads/2019/11/Classic-Quiche-Lorraine-Recipe-Beautiful-flaky-pastry-crust-is-paired-with-a-delicious-savory-egg-custard.-Perfect-for-breakfast-or-brunch.-1-4.jpg",
  "27": "https://media.losandes.com.ar/p/7ab8e044e8850ac7f9494ab077b369fd/adjuntos/368/imagenes/100/064/0100064083/1200x675/smart/receta-facil-como-hacer-las-clasicas-empanadas-argentinas-carne-del-reconocido-chef-gaston-riveira-imagen-ilustrativa-web.jpg",
};

export const dynamic = 'force-dynamic';

export default async function RecetasPage() {
  let recetasDB: any[] = [];
  
  try {
    const { data } = await supabaseServer
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) recetasDB = data;
  } catch (err) {
    console.error("Error consultando recetas en servidor:", err);
  }

  const recetasLocalesBase = [
    { id: "1", titulo: "Encebollado de Pescado", tiempo: "45 min", dificultad: "Media", categoria: "Costa / Sopa" },
    { id: "2", titulo: "Hornado", tiempo: "120 min", dificultad: "Avanzada", categoria: "Sierra / Plato Fuerte" },
    { id: "3", titulo: "Locro de Papa", tiempo: "40 min", dificultad: "Fácil", categoria: "Sierra / Sopa" },
    { id: "4", titulo: "Seco de Pollo", tiempo: "50 min", dificultad: "Media", categoria: "Costa-Sierra / Plato Fuerte" },
    { id: "5", titulo: "Fritada", tiempo: "90 min", dificultad: "Media", categoria: "Sierra / Plato Fuerte" },
    { id: "6", titulo: "Guatita", tiempo: "60 min", dificultad: "Avanzada", categoria: "Costa-Sierra / Plato Fuerte" },
    { id: "7", titulo: "Ceviche de Camarón", tiempo: "30 min", dificultad: "Fácil", categoria: "Costa / Entrada" },
    { id: "8", titulo: "Mote Pillo", tiempo: "25 min", dificultad: "Fácil", categoria: "Sierra / Acompañante" },
    { id: "9", titulo: "Bolón de Verde", tiempo: "20 min", dificultad: "Fácil", categoria: "Costa / Desayuno" },
    { id: "10", titulo: "Llapingacho", tiempo: "40 min", dificultad: "Media", categoria: "Sierra / Plato Fuerte" },
    { id: "11", titulo: "Chuleta Asada con Arroz y Menestra", tiempo: "35 min", dificultad: "Fácil", categoria: "Costa / Plato Fuerte" },
    { id: "12", titulo: "Cazuela de Pescado", tiempo: "50 min", dificultad: "Media", categoria: "Costa / Plato Fuerte" },
    { id: "13", titulo: "Bollo de Pescado", tiempo: "45 min", dificultad: "Media", categoria: "Costa / Plato Fuerte" },
    { id: "14", titulo: "Corviche", tiempo: "30 min", dificultad: "Media", categoria: "Costa / Aperitivo" },
    { id: "15", titulo: "Sopa de Pollo", tiempo: "40 min", dificultad: "Fácil", categoria: "Sopa" },
    { id: "16", titulo: "Carne Apanada con Arroz y Puré", tiempo: "30 min", dificultad: "Fácil", categoria: "Plato Fuerte" },
    { id: "17", titulo: "Seco de Chivo", tiempo: "90 min", dificultad: "Avanzada", categoria: "Plato Fuerte" },
    { id: "18", titulo: "Pescado Frito con Patacones", tiempo: "35 min", dificultad: "Fácil", categoria: "Costa / Plato Fuerte" },
    { id: "19", titulo: "Muchines de Yuca", tiempo: "30 min", dificultad: "Media", categoria: "Costa / Aperitivo" },
    { id: "20", titulo: "Caldo de Bola de Verde", tiempo: "70 min", dificultad: "Avanzada", categoria: "Costa / Sopa" },
  ];

  const recetasSupabaseMapeadas = recetasDB.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    tiempo: "30 min",
    dificultad: "Fácil",
    categoria: "Receta de la Comunidad",
    imagen: item.imagen
  }));

  const recetasLocales = [...recetasSupabaseMapeadas, ...recetasLocalesBase];

  const recetasInternacionales = [
    { id: "21", titulo: "Pasta al limón cremosa", tiempo: "15 min", dificultad: "Fácil", categoria: "Italia / Pasta" },
    { id: "22", titulo: "Tacos de pollo", tiempo: "20 min", dificultad: "Fácil", categoria: "México / Plato Fuerte" },
    { id: "23", titulo: "Ají de gallina", tiempo: "30 min", dificultad: "Media", categoria: "Perú / Plato Fuerte" },
    { id: "24", titulo: "Pollo teriyaki", tiempo: "20 min", dificultad: "Fácil", categoria: "Japón / Plato Fuerte" },
    { id: "25", titulo: "Curry suave", tiempo: "25 min", dificultad: "Fácil", categoria: "India / Plato Fuerte" },
    { id: "26", titulo: "Quiche", tiempo: "45 min", dificultad: "Media", categoria: "Francia / Plato Fuerte" },
    { id: "27", titulo: "Empanadas clásicas", tiempo: "40 min", dificultad: "Media", categoria: "Argentina / Aperitivo" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-16">
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            🍳 Recetario Exclusivo ✨
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Explora Delicias Culinarias</h1>
          <p className="text-orange-100 text-base sm:text-lg max-w-2xl font-medium">
            Desde los rincones más tradicionales del Ecuador hasta las cocinas más icónicas del planeta. Prepara, guarda y disfruta tus platillos favoritos.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recetas de la Comunidad (Ecuador)</h2>
          <p className="text-gray-500 text-sm mt-0.5">Selecciona cualquier tarjeta para ver su preparación detallada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recetasLocales.map((receta: any) => (
            <RecipeCardClient 
              key={receta.id} 
              recipe={{
                ...receta,
                imagen: receta.imagen || imagenesLocales[receta.id] || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"
              }} 
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200/80 pt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            🌍 Recetas Internacionales <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full font-bold">Global</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Platos famosos y conocidos alrededor del mundo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recetasInternacionales.map((receta) => (
            <RecipeCardClient
              key={receta.id}
              recipe={{
                ...receta,
                imagen: imagenesInternacionales[receta.id]
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}