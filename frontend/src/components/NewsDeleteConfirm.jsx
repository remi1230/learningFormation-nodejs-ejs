// src/components/news/ConfirmDeleteModal.jsx
export default function ConfirmDeleteModal({ open, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirmer la suppression</h3>
        <p className="py-4">Voulez-vous vraiment supprimer cet article ?</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button type="button" className="btn" onClick={onCancel}>
              Annuler
            </button>
            <button type="button" className="btn btn-error" onClick={onConfirm}>
              Supprimer
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}