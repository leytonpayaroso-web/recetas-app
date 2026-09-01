import Link from "next/link";

interface RecipeCardProps {
  id: string;
  titulo: string;
  tiempo: string;
  dificultad: string;
  categoria: string;
}

export default function RecipeCard({ id, titulo, tiempo, dificultad, categoria }: RecipeCardProps) {
  return (
    <Link 
      href={`/recetas/${id}`}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 block"
    >
      <div className="p-6 space-y-4">
        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
          {categoria}
        </span>
        <h3 className="text-xl font-bold text-gray-900">{titulo}</h3>
        <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <span>⏱️ {tiempo}</span>
          <span>📊 {dificultad}</span>
        </div>
      </div>
    </Link>
  );
}