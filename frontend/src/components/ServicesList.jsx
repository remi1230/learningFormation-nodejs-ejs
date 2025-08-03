// src/components/ServicesList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ServicesList() {
  const queryClient = useQueryClient();

  // 1️⃣ useQuery avec le format objet
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services-crud', {
        credentials: 'include',  // proxy Vite → localhost:3000
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
  });

  // 2️⃣ useMutation lui aussi en « object »
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/services-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return id;
    },
    onSuccess: () => {
      // invalide et refetch automatiquement
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError)  return <p className="text-red-500">Erreur : {error.message}</p>;

  // selon que l’API renvoie { rows, count } ou juste un tableau
  const services = data.rows ?? data;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Désignation</th>
            <th>Description</th>
            <th>Détails</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.detail}</td>
              <td>
                <button
                  className="btn btn-sm btn-ghost mr-2"
                  onClick={() => {
                    // TODO: navigate(`/services/${service.id}`)
                  }}
                >
                  Voir
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => {
                    if (!window.confirm('Supprimer cet utilisateur ?')) return;
                    deleteMutation.mutate(service.id);
                  }}
                >
                  {deleteMutation.isLoading && deleteMutation.variables === service.id
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