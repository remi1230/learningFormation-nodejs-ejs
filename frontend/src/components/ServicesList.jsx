import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import ServicesForm from './ServicesForm'
import ServicesTable from './ServicesTable'
import ConfirmDeleteModal from './ServicesDeleteConfirm'

const API_BASE = `${import.meta.env.BASE_URL}api`;

async function fetchServices() {
  const res = await fetch(`${API_BASE}/services-crud`, { credentials: 'include' })
  if (!res.ok) throw new Error(`Erreur ${res.status}`)
  return res.json()
}

export default function ServicesList() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(null)     // service en cours d’édition (objet)
  const [toDelete, setToDelete] = useState(null)   // id à supprimer

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  })

  const services = data?.rows ?? data ?? []

  // Trie léger (par nom, puis id)
  const sorted = useMemo(() => {
    return [...services].sort((a, b) =>
      (a?.name || '').localeCompare(b?.name || '') || (a?.id ?? 0) - (b?.id ?? 0)
    )
  }, [services])

  const saveMutation = useMutation({
    mutationFn: async (service) => {
      const url = service.id ? `${API_BASE}/services-crud/${service.id}` : `${API_BASE}/services-crud`
      const method = service.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE}/services-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
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
  if (isError)   return <p className="text-red-500">Erreur : {error.message}</p>

  return (
    <div className="space-y-8">
      <ServicesForm
        initial={editing}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        isSaving={saveMutation.isLoading}
      />

      <ServicesTable
        services={sorted}
        onEdit={handleEdit}
        onAskDelete={handleAskDelete}
        deleting={deleteMutation.isLoading}
        isDeletingId={deleteMutation.variables}
      />

      <ConfirmDeleteModal
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => deleteMutation.mutate(toDelete)}
        title="Confirmer la suppression"
        message="Voulez-vous vraiment supprimer ce service ?"
      />
    </div>
  )
}