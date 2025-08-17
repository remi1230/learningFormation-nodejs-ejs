// src/components/SchedulesSection.jsx
import { useQuery } from '@tanstack/react-query'

export default function SchedulesSection({ title = "Horaires d'ouverture", size = "2xl", marginBottom = "8" }) {
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
      <div className="overflow-x-auto mx-auto rounded-box">
        <ul className="list">
            {schedules.map((schedule) => (
              <li key={schedule.id} className="list-row prose prose-lg">
                <div className="grid grid-cols-[max-content,1fr,1fr] gap-x-4 gap-y-2 text-left">
                  <div className="w-32">{schedule.dayOfWeek}</div>
                  <div>{schedule.openTime.slice(0, -3)}</div>
                  <div>-</div>
                  <div>{schedule.closeTime.slice(0, -3)}</div>
                </div>
              </li>
            ))}
          </ul>
      </div>
    </section>
  )
}