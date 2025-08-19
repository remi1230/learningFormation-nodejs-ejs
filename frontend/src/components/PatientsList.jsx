import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pencil, Plus, Trash2 } from "lucide-react"

export default function CollabsList() {
  const queryClient = useQueryClient()

  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({ email: '', role: 'Patient', password: '', firstName: '', lastName: '' })
  const [userToDelete, setUserToDelete] = useState(null) // 🆕 Pour la modale

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', 'Patients'],
    queryFn: async () => {
      const res = await fetch('/api/users-crud/by-role/Patient', { credentials: 'include' })
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
      setNewUser({ email: '', role: 'Patient', password: '', firstName: '', lastName: '' })
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
      setUserToDelete(null)
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
          e.preventDefault();
          createMutation.mutate(newUser);
        }}
        className="flex gap-4 flex-wrap items-end"
      >

          <div className="flex flex-row gap-4 w-full">
            <div className="flex-[20] grid grid-cols-2 gap-4 w-full">
              <input
                required
                className="input input-bordered"
                placeholder="Nom"
                value={newUser.firstName}
                onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
              />
              <input
                required
                className="input input-bordered"
                placeholder="Prénom"
                value={newUser.lastName}
                onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
              />
              <input
                required
                autoComplete="off"
                className="input input-bordered col-span-full w-full"
                placeholder="Email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
           </div>
           <div className="flex-[10] grid grid-cols-2 gap-4 w-full">
             <input
                required
                autoComplete="off"
                className="input input-bordered tel"
                type="tel"
                placeholder="Téléphone"
                value={newUser.phoneNumber}
                onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              />
              <div></div>
              <input
                required
                autoComplete="off"
                className="input input-bordered"
                type="password"
                placeholder="Mot de passe"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              />
              <button type="submit" className="btn btn-primary w-fit justify-self-start">
                  <Plus className="w-4 h-4" />
              </button>
          </div>
        </div>
      </form>

      {/* 📋 Liste des utilisateurs */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Tél</th>
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
                      value={editingUser.lastName}
                      onChange={e =>
                        setEditingUser({ ...editingUser, lastName: e.target.value })
                      }
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      className="input input-sm"
                      value={editingUser.firstName}
                      onChange={e =>
                        setEditingUser({ ...editingUser, firstName: e.target.value })
                      }
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
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
                    <input
                      className="input input-sm"
                      value={editingUser.phoneNumber}
                      onChange={e =>
                        setEditingUser({ ...editingUser, phoneNumber: e.target.value })
                      }
                    />
                  ) : (
                    user.phoneNumber
                  )}
                </td>
                <td className="space-y-2">
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
                        <Pencil className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧾 Modal DaisyUI */}
      {userToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Supprimer cet utilisateur ?</h3>
            <p className="py-4">Cette action est irréversible.</p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn" onClick={() => setUserToDelete(null)}>Annuler</button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteMutation.mutate(userToDelete)}
                >
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}