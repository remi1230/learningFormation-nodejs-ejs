// src/components/ContactSection.jsx
import { useQuery } from '@tanstack/react-query'
import { Phone, Mail } from "lucide-react";

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

  const formatPhoneNumber = (phoneNumber, sep = ' ') => [...phoneNumber].map((n,i) => i%2==0 ? n : n + sep).join('').slice(0, -1)
  

  return (
    <section className="flex flex-col">
      <h2 className="text-4xl font-bold mb-0">Nous contacter</h2>
      <div className="flex flex-col gap-12 items-center">
      {services.map((service) => (
        <div key={service.id}>
          <h3 className="text-2xl font-bold">{service.name}</h3>   
          <div className="flex flex-col gap-8 mb-6 items-center">
            {(service.Users ?? []).map((user) => (
            <div key={`${service.id}-${user.id}`} className="flex flex-col gap-2 items-center text-lg font-bold">
                <div className="flex flex-row">
                  <div>{user.firstName} {user.lastName}</div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-row gap-2 items-center"><Phone className="h-5 w-5 text-primary" /> {formatPhoneNumber(user.phoneNumber, '.')}</div>
                  <div className="flex flex-row gap-2 items-center"><Mail className="h-5 w-5 text-primary" /> {user.email}</div>
                </div>
            </div>
            ))}
          </div>
          <hr className="border-t-2 border-accent !m-8"/>
        </div>
      ))}
      </div>
    </section>
  )
}