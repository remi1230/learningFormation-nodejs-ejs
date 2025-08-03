// src/components/SchedulesList.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function SchedulesList() {
  const queryClient = useQueryClient();

  // 1️⃣ useQuery avec le format objet
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await fetch('/api/schedules-crud', {
        credentials: 'include',  // proxy Vite → localhost:3000
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return res.json();
    },
  });

  // 2️⃣ useMutation lui aussi en « object »
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/schedules-crud/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      return id;
    },
    onSuccess: () => {
      // invalide et refetch automatiquement
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  if (isLoading) return <p>Chargement…</p>;
  if (isError)  return <p className="text-red-500">Erreur : {error.message}</p>;

  // selon que l’API renvoie { rows, count } ou juste un tableau
  const schedules = data.rows ?? data;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Jour</th>
            <th>AM</th>
            <th>PM</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.id}</td>
              <td>{schedule.dayOfWeek}</td>
              <td >{schedule.openTime}</td>
              <td >{schedule.closeTime}</td>
              <td>
                <button
                  className="btn btn-sm btn-ghost mr-2"
                  onClick={() => {
                    // TODO: navigate(`/schedules/${schedule.id}`)
                  }}
                >
                  Voir
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => {
                    if (!window.confirm('Supprimer cet utilisateur ?')) return;
                    deleteMutation.mutate(schedule.id);
                  }}
                >
                  {deleteMutation.isLoading && deleteMutation.variables === schedule.id
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