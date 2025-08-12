export default function ConfirmDeleteModal({ open, onCancel, onConfirm, title, message }) {
  if (!open) return null
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title || 'Confirmation'}</h3>
        <p className="py-4">{message || 'Êtes-vous sûr ?'}</p>
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
      {/* clic extérieur = ferme */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
