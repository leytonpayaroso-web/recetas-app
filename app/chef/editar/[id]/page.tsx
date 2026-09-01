'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function EditarRecetaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [instrucciones, setInstrucciones] = useState('')
  const [categoria, setCategoria] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [dificultad, setDificultad] = useState('Fácil')
  const [imagen, setImagen] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) cargarReceta()
  }, [id])

  const cargarReceta = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert('Error al cargar la receta: ' + error.message)
      router.push('/chef/gestionar')
    } else if (data) {
      setTitulo(data.titulo || '')
      setDescripcion(data.descripcion || '')
      setIngredientes(data.ingredientes || '')
      setInstrucciones(data.instrucciones || '')
      setCategoria(data.categoria || '')
      setTiempo(data.tiempo || '')
      setDificultad(data.dificultad || 'Fácil')
      setImagen(data.imagen || '')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({
          titulo,
          descripcion,
          ingredientes,
          instrucciones,
          categoria,
          tiempo,
          dificultad,
          imagen
        })
        .eq('id', id)
        .select()

      if (error) throw error

      if (!data || data.length === 0) {
        throw new Error('No se pudo actualizar. Verifica que tengas permisos en Supabase (RLS).')
      }

      alert('¡Receta actualizada con éxito!')
      router.push('/chef/gestionar')
      router.refresh()
    } catch (err: any) {
      alert('Error al actualizar: ' + (err.message || ''))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 pt-32 text-center text-gray-500">Cargando datos de la receta...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-black text-gray-900">✏️ Editar Receta</h1>
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
                className="w-full p-3 border rounded-xl text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tiempo</label>
              <input
                type="text"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
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
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Ingredientes</label>
            <textarea
              required
              rows={4}
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Instrucciones de Preparación</label>
            <textarea
              required
              rows={4}
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              className="w-full p-3 border rounded-xl text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white font-bold p-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
          >
            {saving ? 'Guardando Cambios...' : 'Actualizar Receta'}
          </button>
        </form>
      </div>
    </div>
  )
}