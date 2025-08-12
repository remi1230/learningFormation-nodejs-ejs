// src/components/news/NewsTable.jsx
import { memo, useMemo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { formatFR } from '../utils/dateFormat'
import RichTextView from './ui-kit/RichTextView'

/** Version légère si tu veux éviter un rendu HTML lourd
function Excerpt({ html }) {
  const text = useMemo(() => html?.replace(/<[^>]*>/g, '') ?? '', [html])
  return <div className="line-clamp-3">{text}</div>
}
*/

const HtmlPreview = memo(function HtmlPreview({ html }) {
  return (
    <div className="line-clamp-3">
      <RichTextView html={html} />
    </div>
  )
}, (prev, next) => prev.html === next.html)

const NewsTable = memo(function NewsTable({ news, onEdit, onAskDelete, deleting, isDeletingId }) {
  return (
    <div className="overflow-y-scroll h-80 [scrollbar-gutter:stable]">
      <table className="table table-zebra table-sm table-fixed w-full">
        <colgroup>
          <col style={{ width: '70px' }} />
          <col style={{ width: '140px' }} />
          <col />
          <col />
          <col style={{ width: '120px' }} />
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Titre</th>
            <th>Contenu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{formatFR(n.publishedDate) || n.publishedDate}</td>
              <td className="font-medium">{n.title}</td>
              <td><HtmlPreview html={n.content} /></td>
              <td className="flex flex-col items-center gap-2 pt-4">
                <button className="btn btn-sm btn-secondary" onClick={() => onEdit(n)}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="btn btn-sm btn-error" onClick={() => onAskDelete(n.id)}>
                  {deleting && isDeletingId === n.id ? '…' : <Trash2 className="w-4 h-4" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default NewsTable