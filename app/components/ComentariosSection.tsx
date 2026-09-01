'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ComentariosSection({ recipeId }: { recipeId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    fetchComments()
  }, [recipeId])

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setComments(data)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setLoading(true)

    const { error } = await supabase.from('comments').insert([
      {
        recipe_id: recipeId,
        user_email: user.email,
        content: newComment,
      },
    ])

    if (!error) {
      setNewComment('')
      fetchComments() 
    } else {
      alert('Error al publicar el comentario')
    }

    setLoading(false)
  }

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Comentarios de la Comunidad 💬</h3>

      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu opinión o consejo sobre esta receta..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3 text-gray-800"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-orange-700 transition duration-200 disabled:opacity-50 shadow-md shadow-orange-600/20"
          >
            {loading ? 'Publicando...' : 'Comentar'}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
          Debes iniciar sesión para dejar un comentario.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">Sé el primero en comentar esta receta.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                  👤 {comment.user_email}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}