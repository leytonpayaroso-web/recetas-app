'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GestionarRecetasPage() {
  const [recetas, setRecetas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    cargarRecetas()
  }, [])

  const cargarRecetas = async () => {
    const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
    if (error) console.error('Error al cargar:', error.message)
    else setRecetas(data || [])
    setLoading(false)
  }

  const eliminarReceta = async (id: string) => {
    if (!confirm('¿Estás segura de eliminar esta receta?')) return
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) {
      alert('Error al eliminar la receta')
    } else {
      alert('¡Receta eliminada con éxito!')
      cargarRecetas()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-black text-gray-900">Gestionar Recetas (CRUD Completo)</h1>
        <Link href="/chef/publicar" className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
          + Nueva Receta
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando recetas...</p>
      ) : recetas.length === 0 ? (
        <p className="text-gray-500">No hay recetas registradas todavía.</p>
      ) : (
        <div className="space-y-4">
          {recetas.map((receta) => (
            <div key={receta.id} className="bg-white p-6 rounded-2xl shadow border border-orange-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{receta.titulo}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{receta.descripcion}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/chef/editar/${receta.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarReceta(receta.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}