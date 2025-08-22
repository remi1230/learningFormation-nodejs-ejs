// src/components/NewsSection.jsx
import { useQuery } from '@tanstack/react-query'
import RichTextView from './ui-kit/RichTextView';
import { formatFRLong } from "../utils/dateFormat";

const API_BASE = `${import.meta.env.BASE_URL}api`;

export default function NewsSection() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/news-crud`, {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`)
      }
      return res.json()
    },
    retry: false,
  })

  if (isLoading) return <p>Chargement des actualités...</p>
  if (isError)   return <p className="text-red-500">Erreur : {error.message}</p>

  // Si votre CRUD renvoie { rows, count } :
  const news = data.rows ?? data

  return (
    <section className="flex flex-col mb-12">
      <h2 className="text-4xl font-bold text-primary mb-8">Actualités</h2>
      <div className="flex flex-col gap-12 items-center">
      {news.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)).map((theNew) => (
        <div key={theNew.id} className="card w-full border shadow-sm">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <div className="flex gap-4 items-center collapse-title pb-5 text-xl font-semibold">
              <div className="badge badge-accent badge-xs">{formatFRLong(theNew.publishedDate)}</div>
              <div className="text-2xl">{theNew.title}</div>
            </div>
            <div className="collapse-content text-base leading-relaxed text-justify">
              <RichTextView html={theNew.content} />
            </div>
          </div>
        </div>
      ))}
      </div>
    </section>
  )
}