// src/components/news/NewsForm.jsx
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import DatePicker from './ui-kit/DatePicker.jsx'
import RichEditor from './ui-kit/RichEditor'

const EMPTY = { id: null, title: '', content: '', publishedDate: '' }

export default function NewsForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(() => initial ?? EMPTY)

  useEffect(() => {
    setForm(initial ?? EMPTY)
  }, [initial])

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSave(form)
      }}
    >
      <div className="flex gap-4">
        <div className="flex-[1] form-control">
          {/* On garde l’API de ton DatePicker */}
          <DatePicker formData={form} setFormData={setForm} placeHolder="Date de publication" />
        </div>
        <div className="flex-[2] form-control">
          <input
            className="input input-bordered w-full"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="form-control grow">
        <label className="label">Contenu</label>
        <RichEditor
          value={form.content || ''}
          onChange={(html) => setForm(f => (f.content === html ? f : { ...f, content: html }))}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary h-fit" disabled={isSaving}>
          {form.id ? 'Modifier' : <Plus className="w-4 h-4" />}
        </button>
        {form.id && (
          <button type="button" className="btn h-fit" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}