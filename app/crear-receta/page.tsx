'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CrearRecetaPage() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [instrucciones, setInstrucciones] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Debes iniciar sesión para publicar una receta.')
      }

      // Enviando datos con columnas 100% en español
      const { error } = await supabase.from('recipes').insert([
        {
          titulo: titulo,
          descripcion: descripcion,
          ingredientes: ingredientes,
          instrucciones: instrucciones,
          imagen: imagenUrl,
          user_id: user.id,
        }
      ])

      if (error) throw error

      router.push('/recetas')
      router.refresh()
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al guardar la receta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">✨ Publicar Nueva Receta</h1>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Receta</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej. Lasaña casera"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Breve descripción de tu plato..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
            <textarea
              required
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Lista los ingredientes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones de preparación</label>
            <textarea
              required
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Paso a paso..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-200 disabled:opacity-50 shadow-md shadow-emerald-600/20"
          >
            {loading ? 'Publicando...' : 'Guardar y Publicar Receta'}
          </button>
        </form>
      </div>
    </div>
  )
}