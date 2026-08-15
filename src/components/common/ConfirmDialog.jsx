import Modal from "./Modal"

/** Confirmation dialog for destructive actions. */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "هل أنت متأكد؟",
  message,
  confirmLabel = "تأكيد",
  loading = false,
  danger = true,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
          >
            إلغاء
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="spinner" style={{ borderTopColor: "#fff", width: 16, height: 16 }} />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="muted" style={{ margin: 0 }}>
        {message}
      </p>
    </Modal>
  )
}
