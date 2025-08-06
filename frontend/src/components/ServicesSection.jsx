// src/components/ServicesSection.jsx
import { useQuery } from '@tanstack/react-query'

export default function ServicesSection() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await fetch('/api/services-crud', {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`)
      }
      return res.json()
    },
    retry: false,
  })

  if (isLoading) return <p>Chargement des services…</p>
  if (isError)   return <p className="text-red-500">Erreur : {error.message}</p>

  // Si votre CRUD renvoie { rows, count } :
  const services = data.rows ?? data

  return (
    <section className="flex flex-col mb-48">
      <h2 className="text-4xl font-bold text-primary mb-8">Services proposés</h2>
      <div className="flex flex-wrap gap-6 items-start">
      {services.map((service) => (
        <div key={service.id} className="card w-96 min-h-64 border border-info text-info shadow-sm">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-semibold">
              <h3 className="text-info">{service.name}</h3>
              <p className="text-base">{service.description}</p>
            </div>
            <div className="collapse-content text-sm leading-relaxed text-justify">
              <p>{service.detail}</p>
            </div>
          </div>
        </div>
      ))}
      </div>
    </section>
  )
}