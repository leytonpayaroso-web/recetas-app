import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl text-center space-y-6">
        <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide">
          Bienvenido a RecetasApp 🍳
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
          Descubre y comparte las <span className="text-orange-600">mejores recetas</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Explora una gran variedad de platos deliciosos, guarda tus favoritos y cocina como un profesional paso a paso.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            href="/recetas"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Ver Recetas 🍲
          </Link>
          <Link
            href="/favoritos"
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium px-8 py-3 rounded-xl shadow-sm transition-all"
          >
            Mis Favoritos ❤️
          </Link>
        </div>
      </div>
    </div>
  );
}