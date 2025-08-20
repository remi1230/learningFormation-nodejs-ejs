import { memo } from 'react'
import { Pencil, Check, X } from "lucide-react"
import RichTextView from './ui-kit/RichTextView'

const HtmlPreview = memo(function HtmlPreview({ html }) {
  return (
    <div className="line-clamp-3">
      <RichTextView html={html} />
    </div>
  )
}, (prev, next) => prev.html === next.html)

const ServicesTable = memo(function ServicesTable({
  services,
  onEdit,
  onAskDelete,
  deleting,
  isDeletingId,
}) {
  return (
    <div className="overflow-y-scroll h-72 [scrollbar-gutter:stable]">
      <table className="table table-zebra table-sm table-fixed w-full">
        <colgroup>
          <col style={{ width: '70px' }} />
          <col style={{ width: '240px' }} />
          <col style={{ width: '90px' }} />
          <col />
          <col />
          <col style={{ width: '120px' }} />
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>Désignation</th>
            <th>Couleur</th>
            <th>Description</th>
            <th>Détails</th>
            <th className='text-center'>Actif</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td className="font-medium">{s.name}</td>
              <td className="text-center align-middle">
                <div
                  style={{ backgroundColor: s.color || '#000000' }}
                  className="w-5 h-5 rounded-full inline-block"
                />
              </td>
              <td>{s.description}</td>
              <td><HtmlPreview html={s.detail} /></td>
              <td className="font-medium text-center">
                {!s.obsolete ? <Check className="text-success w-5 h-5 ml-10" /> : <X className="text-error w-5 h-5 ml-10" />}
              </td>
              <td className="">
                <button className="btn btn-sm btn-secondary" onClick={() => onEdit(s)}>
                  <Pencil className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default ServicesTable