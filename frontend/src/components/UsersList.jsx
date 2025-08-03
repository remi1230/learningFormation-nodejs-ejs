// src/components/UsersList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function UsersList() {
  const queryClient = useQueryClient();

  // 1️⃣ useQuery avec le format objet
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users', {
        credentials: 'include',  // proxy Vite → localhost:3000
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
  });

  // 2️⃣ useMutation lui aussi en « object »
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return id;
    },
    onSuccess: () => {
      // invalide et refetch automatiquement
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError)  return <p className="text-red-500">Erreur : {error.message}</p>;

  // selon que l’API renvoie { rows, count } ou juste un tableau
  const users = data.rows ?? data;

  return (
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td className="capitalize">{user.role}</td>
              <td>
                <button
                  className="btn btn-sm btn-ghost mr-2"
                  onClick={() => {
                    // TODO: navigate(`/users/${user.id}`)
                  }}
                >
                  Voir
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => {
                    if (!window.confirm('Supprimer cet utilisateur ?')) return;
                    deleteMutation.mutate(user.id);
                  }}
                >
                  {deleteMutation.isLoading && deleteMutation.variables === user.id
                    ? '…'
                    : 'Supprimer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}