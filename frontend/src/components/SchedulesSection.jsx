// src/components/SchedulesSection.jsx
import { useQuery } from '@tanstack/react-query'

export default function SchedulesSection({ title = "--- Horaires d'ouverture ---", size = "2xl", marginBottom = "2" }) {
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
    <section className="flex flex-col text-center">
      <h2 className={`text-${size} font-bold mb-${marginBottom}`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-lg mt-0 mb-0 text-center">
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id ?? schedule.dayOfWeek}>
                <td>{schedule.dayOfWeek}</td>
                <td className="text-center">{schedule.openTime.slice(0, -3)}</td>
                <td className="text-center">{schedule.closeTime.slice(0, -3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}