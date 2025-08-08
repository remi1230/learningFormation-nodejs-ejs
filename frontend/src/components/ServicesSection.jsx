// src/components/ServicesSection.jsx
import { useQuery } from '@tanstack/react-query'
import RichTextView from './ui-kit/RichTextView';

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
      <div className="flex flex-col gap-6 items-center">
      {services.map((service) => (
        <div key={service.id} className="card w-full border shadow-sm">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title p-0 text-xl font-semibold">
              <h3>{service.name}</h3>
              <p className="text-xl">{service.description}</p>
            </div>
            <div className="collapse-content text-base leading-relaxed text-justify">
              <RichTextView html={service.detail} />
            </div>
          </div>
        </div>
      ))}
      </div>
    </section>
  )
}