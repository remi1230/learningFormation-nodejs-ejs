import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import RichEditor from './ui-kit/RichEditor'

const EMPTY = { id: null, name: '', description: '', detail: '', color: '#666666' }

export default function ServicesForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(() => initial ?? EMPTY)

  useEffect(() => {
    setForm(initial ?? EMPTY)
  }, [initial])

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => { e.preventDefault(); onSave(form) }}
    >
      <div className="flex flex-row gap-4">
        <div className="basis-4/12 form-control grow">
          <input
            placeholder="Désignation"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div className="basis-1/12 form-control grow">
          <div
            className="tooltip w-full"
            data-tip={`Couleur du service : ${form.color || '#000000'}`}
          >
            <input
              type="color"
              value={form.color || '#000000'}
              onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
              required
              className="w-full h-10 rounded-lg border border-base-300 cursor-pointer p-0"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundColor: form.color || '#000000',
              }}
            />
          </div>

          <style>{`
            input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; border-radius: 0.5rem; }
            input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.5rem; }
            input[type="color"]::-moz-color-swatch { border: none; border-radius: 0.5rem; }
          `}</style>
        </div>

        <div className="basis-7/12 form-control grow">
          <input
            placeholder="Description"
            className="input input-bordered w-full"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="form-control grow">
        <label className="label">Détails</label>
        <RichEditor
          value={form.detail || ''}
          onChange={(html) =>
            setForm(f => (f.detail === html ? f : ({ ...f, detail: html })))
          }
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