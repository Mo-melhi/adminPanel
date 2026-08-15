import { useState } from "react"
import Modal from "../common/Modal"

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  country: "",
  status: "نشط",
}

export default function CustomerFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}) {
  const [form, setForm] = useState(initial || EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(initial?.id)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const e = {}

    if (!form.name.trim()) {
      e.name = "الاسم مطلوب"
    }

    if (!form.email.trim()) {
      e.email = "البريد الإلكتروني مطلوب"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "أدخل بريدًا إلكترونيًا صالحًا"
    }

    const phone = form.phone.trim()

    if (!phone) {
      e.phone = "رقم الهاتف مطلوب"
    } else {
      const normalizedPhone = phone.replace(/[\s\-().]/g, "")

      if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
        e.phone = "أدخل رقم هاتف صالح"
      }
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()

    if (!validate()) return

    setSaving(true)

    try {
      await onSubmit(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "تعديل العميل" : "إضافة عميل"}
    >
      <form onSubmit={handleSubmit} className="customer-form">

        {/* الاسم الكامل */}
        <div className="form-field full-width">
          <label>الاسم الكامل</label>

          <input
            className={`input ${errors.name ? "has-error" : ""}`}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="محمد أحمد"
          />

          {errors.name && (
            <span className="form-error">
              {errors.name}
            </span>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div className="form-field">
          <label>البريد الإلكتروني</label>

          <input
            className={`input ${errors.email ? "has-error" : ""}`}
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@email.com"
          />

          {errors.email && (
            <span className="form-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* رقم الهاتف */}
        <div className="form-field">
          <label>رقم الهاتف</label>

          <input
            className={`input ${errors.phone ? "has-error" : ""}`}
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 555 012 3456"
          />

          {errors.phone && (
            <span className="form-error">
              {errors.phone}
            </span>
          )}
        </div>

        {/* الدولة */}
        <div className="form-field">
          <label>الدولة</label>

          <input
            className="input"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="الولايات المتحدة"
          />
        </div>

        {/* الحالة */}
        <div className="form-field">
          <label>الحالة</label>

          <select
            className="input"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        {/* الأزرار */}
        <div className="form-actions full-width">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={saving}
          >
            إلغاء
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "جارٍ الحفظ..."
              : isEdit
                ? "حفظ التغييرات"
                : "إضافة العميل"}
          </button>
        </div>

      </form>
    </Modal>
  )
}