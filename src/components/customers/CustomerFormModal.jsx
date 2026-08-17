import { useEffect, useState } from "react"
import Modal from "../common/Modal"

const EMPTY = {
  full_name: "",
  phone: "",
  whatsapp_number: "",
  passport_number: "",
  nationality: "",
  notes: "",
}

export default function CustomerFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(initial?.id)

  useEffect(() => {
    if (!open) return

    setForm(
      initial
        ? {
          full_name: initial.full_name || "",
          phone: initial.phone || "",
          whatsapp_number: initial.whatsapp_number || "",
          passport_number: initial.passport_number || "",
          nationality: initial.nationality || "",
          notes: initial.notes || "",
        }
        : EMPTY
    )

    setErrors({})
  }, [open, initial])

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }))
  }

  function validate() {
    const e = {}

    if (!form.full_name.trim()) {
      e.full_name = "الاسم الكامل مطلوب"
    } else if (form.full_name.trim().length < 3) {
      e.full_name = "الاسم يجب أن يحتوي على 3 أحرف على الأقل"
    }

    const phone = form.phone.trim()

    if (!phone) {
      e.phone = "رقم الهاتف مطلوب"
    } else {
      const normalizedPhone = phone.replace(/[\s\-().]/g, "")

      if (!/^\+?[0-9]{8,20}$/.test(normalizedPhone)) {
        e.phone = "أدخل رقم هاتف صالح"
      }
    }

    if (form.whatsapp_number.trim()) {
      const whatsapp = form.whatsapp_number
        .trim()
        .replace(/[\s\-().]/g, "")

      if (!/^\+?[0-9]{8,20}$/.test(whatsapp)) {
        e.whatsapp_number = "أدخل رقم واتساب صالح"
      }
    }

    if (!form.passport_number.trim()) {
      e.passport_number = "رقم جواز السفر مطلوب"
    } else if (form.passport_number.trim().length < 5) {
      e.passport_number = "رقم جواز السفر يجب أن يحتوي على 5 أحرف على الأقل"
    }

    if (!form.nationality.trim()) {
      e.nationality = "الجنسية مطلوبة"
    } else if (form.nationality.trim().length < 2) {
      e.nationality = "الجنسية غير صالحة"
    }

    setErrors(e)

    return Object.keys(e).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) return

    setSaving(true)

    try {
      const payload = {
        ...form,
        full_name: form.full_name.trim(),
        phone: form.phone
          .trim()
          .replace(/[\s\-().+]/g, ""),
        whatsapp_number: form.whatsapp_number.trim()
          ? form.whatsapp_number
            .trim()
            .replace(/[\s\-().+]/g, "")
          : undefined,
        passport_number: form.passport_number.trim(),
        nationality: form.nationality.trim(),
        notes: form.notes.trim() || undefined,
      }

      await onSubmit(payload)
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
            className={`input ${errors.full_name ? "has-error" : ""}`}
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
            placeholder="محمد المسافر"
          />

          {errors.full_name && (
            <span className="form-error">
              {errors.full_name}
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
            placeholder="905551234567"
          />

          {errors.phone && (
            <span className="form-error">
              {errors.phone}
            </span>
          )}
        </div>

        {/* رقم الواتساب */}
        <div className="form-field">
          <label>رقم الواتساب</label>

          <input
            className={`input ${errors.whatsapp_number ? "has-error" : ""}`}
            type="tel"
            dir="ltr"
            inputMode="tel"
            value={form.whatsapp_number}
            onChange={(e) =>
              update("whatsapp_number", e.target.value)
            }
            placeholder="905551234567"
          />

          {errors.whatsapp_number && (
            <span className="form-error">
              {errors.whatsapp_number}
            </span>
          )}
        </div>

        {/* رقم جواز السفر */}
        <div className="form-field">
          <label>رقم جواز السفر</label>

          <input
            className={`input ${errors.passport_number ? "has-error" : ""}`}
            dir="ltr"
            value={form.passport_number}
            onChange={(e) =>
              update("passport_number", e.target.value)
            }
            placeholder="A12345678"
          />

          {errors.passport_number && (
            <span className="form-error">
              {errors.passport_number}
            </span>
          )}
        </div>

        {/* الجنسية */}
        <div className="form-field">
          <label>الجنسية</label>

          <input
            className={`input ${errors.nationality ? "has-error" : ""}`}
            value={form.nationality}
            onChange={(e) =>
              update("nationality", e.target.value)
            }
            placeholder="اليمنية"
          />

          {errors.nationality && (
            <span className="form-error">
              {errors.nationality}
            </span>
          )}
        </div>

        {/* الملاحظات */}
        <div className="form-field full-width">
          <label>ملاحظات</label>

          <textarea
            className={`input ${errors.notes ? "has-error" : ""}`}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="أضف أي ملاحظات خاصة بالعميل..."
            rows={4}
          />

          {errors.notes && (
            <span className="form-error">
              {errors.notes}
            </span>
          )}
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