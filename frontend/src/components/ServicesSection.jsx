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
      const res = await fetch('/api/services-crud/with-collabs', {
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
    <section className="flex flex-col">
      <h2 className="text-4xl font-bold text-primary mb-8 mt-0">Services proposés</h2>
      <div className="flex flex-col gap-12 items-center">
      {services.map((service) => (
        <div key={service.id} className="card w-full border shadow-sm">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
              <div className="collapse-title pt-4 pb-0 text-xl font-semibold">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-2 items-center">
                    {
                      service.Users.map((user) => (
                        <div key={user.id} className="badge badge-xs badge-info">{user.firstName} {user.lastName}</div>
                      ))
                    }
                  </div>
                  <div className="text-2xl flex-1 text-center">{service.name}</div>
                </div>
                  <p className="text-lg">{service.description}</p>
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