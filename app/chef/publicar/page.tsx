'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PublicarRecetaPage() {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [instrucciones, setInstrucciones] = useState('')
  const [categoria, setCategoria] = useState('Costa / Plato Fuerte')
  const [tiempo, setTiempo] = useState('45 min')
  const [dificultad, setDificultad] = useState('Fácil')
  const [imagen, setImagen] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!titulo.trim() || !descripcion.trim() || !ingredientes.trim() || !instrucciones.trim()) {
      alert('Por favor completa todos los campos obligatorios.')
      return
    }
    setLoading(true)

    try {
      // 1. Obtener el usuario autenticado actual para asignar su user_id
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('No se encontró una sesión activa. Inicia sesión nuevamente.')
      }

      // 2. Insertar la receta incluyendo el user_id
      const { error } = await supabase
        .from('recipes')
        .insert([{ 
          titulo, 
          descripcion, 
          ingredientes, 
          instrucciones,
          categoria, 
          tiempo, 
          dificultad, 
          imagen: imagen.trim() || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352',
          user_id: user.id 
        }])

      if (error) throw error

      alert('¡Receta publicada con éxito!')
      router.push('/chef/gestionar')
      router.refresh()
    } catch (err: any) {
      alert('Error al publicar: ' + (err.message || ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-black text-gray-900">✨ Publicar Nueva Receta</h1>
          <Link href="/chef/gestionar" className="text-sm font-bold text-orange-600 hover:underline">← Volver al Panel</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título de la Receta</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Pollo a la Coca-Cola"
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ej. Costa / Plato Fuerte"
                className="w-full p-3 border rounded-xl text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tiempo</label>
              <input
                type="text"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                placeholder="Ej. 45 min"
                className="w-full p-3 border rounded-xl text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Dificultad</label>
              <select
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                className="w-full p-3 border rounded-xl text-gray-800 bg-white"
              >
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Avanzada">Avanzada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">URL de la Imagen</label>
            <input
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descripción Corta</label>
            <textarea
              required
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción del plato..."
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ingredientes</label>
            <textarea
              required
              rows={3}
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              placeholder="Lista de ingredientes..."
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Instrucciones de Preparación</label>
            <textarea
              required
              rows={3}
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              placeholder="Paso a paso de la preparación..."
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-bold p-3 rounded-xl hover:bg-orange-700 transition shadow-md shadow-orange-600/20"
          >
            {loading ? 'Guardando...' : 'Guardar y Publicar Receta'}
          </button>
        </form>
      </div>
    </div>
  )
}