// src/components/news/NewsList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import NewsForm from './NewsForm'
import NewsTable from './NewsTable'
import NewsDeleteConfirm from './NewsDeleteConfirm'
import "cally"
import 'react-big-calendar/lib/css/react-big-calendar.css'

async function fetchNews() {
  const res = await fetch('/api/news-crud', { credentials: 'include' })
  if (!res.ok) throw new Error(`Erreur ${res.status}`)
  return res.json()
}

export default function NewsList() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(null)     // objet news en cours d’édition
  const [toDelete, setToDelete] = useState(null)   // id à supprimer

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  })

  const news = data?.rows ?? data ?? []

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) =>
      new Date(b?.publishedDate ?? 0) - new Date(a?.publishedDate ?? 0)
    )
  }, [news])

  const saveMutation = useMutation({
    mutationFn: async (theNew) => {
      const url = theNew.id ? `/api/news-crud/${theNew.id}` : '/api/news-crud'
      const method = theNew.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theNew),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/news-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      setToDelete(null)
    },
  })

  const handleSave = useCallback(async (payload) => {
    await saveMutation.mutateAsync(payload)
  }, [saveMutation])

  const handleEdit = useCallback((item) => setEditing(item), [])
  const handleAskDelete = useCallback((id) => setToDelete(id), [])
  const handleCancelEdit = useCallback(() => setEditing(null), [])

  if (isLoading) return <p>Chargement…</p>
  if (isError) return <p className="text-red-500">Erreur : {error.message}</p>

  return (
    <div className="space-y-8">
      {/* Formulaire (local state) */}
      <NewsForm initial={editing} onSave={handleSave} onCancel={handleCancelEdit} isSaving={saveMutation.isLoading} />

      {/* Tableau (memo) */}
      <NewsTable
        news={sortedNews}
        onEdit={handleEdit}
        onAskDelete={handleAskDelete}
        isDeletingId={deleteMutation.variables}
        deleting={deleteMutation.isLoading}
      />

      {/* Modal confirmation suppression */}
      <NewsDeleteConfirm
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => deleteMutation.mutate(toDelete)}
      />
    </div>
  )
}