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
      <div className="overflow-x-auto grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center">
        {services.map((service) => (
          <div
            key={service.id ?? service.name}
            className="card card-xs w-96 card-border border-info shadow-sm text-info"
          >
            <div className="card-body items-center">
              <h3 className="card-title text-2xl text-info">{service.name}</h3>
              <p className="text-lg">{service.description}</p>
              <div className="justify-end card-actions text-base">
                <p>{service.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}