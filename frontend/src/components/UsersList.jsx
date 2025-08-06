// src/components/UsersList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function UsersList() {
  const queryClient = useQueryClient()

  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({ email: '', role: 'Patient', password: '' })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users-crud', { credentials: 'include' })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return res.json()
    },
  })

  const users = data?.rows ?? data ?? []

  const createMutation = useMutation({
    mutationFn: async user => {
      const res = await fetch('/api/users-crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setNewUser({ email: '', role: 'Patient', password: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async id => {
      const res = await fetch(`/api/users-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async user => {
      const res = await fetch(`/api/users-crud/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditingUser(null)
    },
  })

  if (isLoading) return <p>Chargement…</p>
  if (isError) return <p className="text-red-500">Erreur : {error.message}</p>

  return (
    <div className="space-y-8">
      {/* ➕ Formulaire de création */}
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!newUser.email || !newUser.password) {
            alert('Email et mot de passe requis')
            return
          }
          createMutation.mutate(newUser)
        }}
        className="flex gap-4 flex-wrap items-end"
      >
        <input
          className="input input-bordered"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          className="select select-bordered"
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="Patient">Patient</option>
          <option value="Professional">Professional</option>
        </select>
        <input
          className="input input-bordered"
          type="password"
          placeholder="Mot de passe"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">
          Ajouter
        </button>
      </form>

      {/* 📋 Liste des utilisateurs */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      className="input input-sm"
                      value={editingUser.email}
                      onChange={e =>
                        setEditingUser({ ...editingUser, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <select
                      className="select select-sm"
                      value={editingUser.role}
                      onChange={e =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                    >
                      <option value="Patient">Patient</option>
                      <option value="Professional">Professional</option>
                    </select>
                  ) : (
                    <span className="capitalize">{user.role}</span>
                  )}
                </td>
                <td className="space-x-2">
                  {editingUser?.id === user.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => updateMutation.mutate(editingUser)}
                      >
                        Sauver
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setEditingUser(null)}
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setEditingUser(user)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => {
                          if (window.confirm('Supprimer cet utilisateur ?')) {
                            deleteMutation.mutate(user.id)
                          }
                        }}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}