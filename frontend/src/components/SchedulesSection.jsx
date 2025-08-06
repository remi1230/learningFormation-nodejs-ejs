// src/components/SchedulesSection.jsx
import { useQuery } from '@tanstack/react-query'

export default function SchedulesSection() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await fetch('/api/schedules-crud', {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`)
      }
      return res.json()
    },
    retry: false,
  })

  if (isLoading) return <p>Chargement des horaires…</p>
  if (isError)   return <p className="text-red-500">Erreur : {error.message}</p>

  // Si ton CRUD renvoie { rows, count } :
  const schedules = data.rows ?? data.sort((a, b) => a.order - b.order)

  return (
    <section className="flex flex-col text-center mt-6">
      <h2 className="text-4xl font-bold text-primary mb-2">Horaires d'ouverture</h2>
      <div className="overflow-x-auto">
        <table className="table table-lg mt-0 mb-0 text-center">
          <thead className="text-2xl">
            <tr>
              <th>Jour</th>
              <th>Matin</th>
              <th>Après-midi</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id ?? schedule.dayOfWeek}>
                <td>{schedule.dayOfWeek}</td>
                <td>{schedule.openTime.slice(0, -3)}</td>
                <td>{schedule.closeTime.slice(0, -3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}