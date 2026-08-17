import { useEffect, useState } from "react"
import Modal from "../common/Modal"
import "./BookingForm.css"

const EMPTY = {
    customer_id: "",
    ticket_number: "",
    pnr: "",
    airline: "",
    flight_number: "",
    departure_airport_name: "",
    departure_airport_code: "",
    departure_city: "",
    arrival_airport_name: "",
    arrival_airport_code: "",
    arrival_city: "",
    departure_datetime: "",
    arrival_datetime: "",
    ticket_class: "Economy",
    trip_type: "One Way",
    price: "",
    currency: "USD",
    booking_status: "Pending",
}

function toDateTimeLocal(value) {
    if (!value) return ""

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ""
    }

    const offset = date.getTimezoneOffset()

    const localDate = new Date(
        date.getTime() - offset * 60 * 1000
    )

    return localDate.toISOString().slice(0, 16)
}

export default function BookingFormModal({
    open,
    onClose,
    onSubmit,
    customers = [],
    initial = null,
}) {
    const [form, setForm] = useState(initial || EMPTY)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    const isEdit = Boolean(initial?.id)

    useEffect(() => {
        if (!open) return

        if (initial) {
            setForm({
                ...initial,

                customer_id: String(
                    initial.customer_id ?? ""
                ),

                departure_datetime:
                    toDateTimeLocal(
                        initial.departure_datetime
                    ),

                arrival_datetime:
                    toDateTimeLocal(
                        initial.arrival_datetime
                    ),

                price: String(
                    initial.price ?? ""
                ),
            })
        } else {
            setForm(EMPTY)
        }

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

        if (!form.customer_id) {
            e.customer_id = "اختر العميل"
        }

        if (!form.airline.trim()) {
            e.airline = "شركة الطيران مطلوبة"
        }

        if (!form.flight_number.trim()) {
            e.flight_number = "رقم الرحلة مطلوب"
        }

        if (!form.departure_city.trim()) {
            e.departure_city = "مدينة المغادرة مطلوبة"
        }

        if (!form.departure_airport_name.trim()) {
            e.departure_airport_name = "اسم مطار المغادرة مطلوب"
        }

        if (!/^[A-Za-z]{3}$/.test(form.departure_airport_code.trim())) {
            e.departure_airport_code = "رمز المطار يجب أن يتكون من 3 أحرف"
        }

        if (!form.arrival_city.trim()) {
            e.arrival_city = "مدينة الوصول مطلوبة"
        }

        if (!form.arrival_airport_name.trim()) {
            e.arrival_airport_name = "اسم مطار الوصول مطلوب"
        }

        if (!/^[A-Za-z]{3}$/.test(form.arrival_airport_code.trim())) {
            e.arrival_airport_code = "رمز المطار يجب أن يتكون من 3 أحرف"
        }

        if (!form.departure_datetime) {
            e.departure_datetime = "تاريخ المغادرة مطلوب"
        }

        if (!form.arrival_datetime) {
            e.arrival_datetime = "تاريخ الوصول مطلوب"
        }

        if (form.price === "") {
            e.price = "السعر مطلوب"
        } else if (Number(form.price) < 0) {
            e.price = "السعر لا يمكن أن يكون سالبًا"
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

                customer_id: Number(form.customer_id),

                ticket_number:
                    form.ticket_number.trim() || undefined,

                pnr:
                    form.pnr.trim() || undefined,

                airline:
                    form.airline.trim(),

                flight_number:
                    form.flight_number.trim(),

                departure_airport_name:
                    form.departure_airport_name.trim(),

                departure_airport_code:
                    form.departure_airport_code.trim().toUpperCase(),

                departure_city:
                    form.departure_city.trim(),

                arrival_airport_name:
                    form.arrival_airport_name.trim(),

                arrival_airport_code:
                    form.arrival_airport_code.trim().toUpperCase(),

                arrival_city:
                    form.arrival_city.trim(),

                departure_datetime:
                    form.departure_datetime,

                arrival_datetime:
                    form.arrival_datetime,

                price:
                    Number(form.price),

                currency:
                    form.currency.toUpperCase(),

                booking_status:
                    form.booking_status,
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
            title={isEdit ? "تعديل الحجز" : "إضافة حجز"}
            size="lg"
        >
            <form
                onSubmit={handleSubmit}
                className="booking-form"
                dir="rtl"
            >

                {/* العميل */}
                <div className="form-field full-width">
                    <label>العميل</label>

                    <select
                        className={`input ${errors.customer_id ? "has-error" : ""}`}
                        value={form.customer_id}
                        onChange={(e) =>
                            update("customer_id", e.target.value)
                        }
                    >
                        <option value="">اختر العميل</option>

                        {customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.full_name}
                            </option>
                        ))}
                    </select>

                    {errors.customer_id && (
                        <span className="form-error">
                            {errors.customer_id}
                        </span>
                    )}
                </div>

                {/* رقم الحجز / PNR */}
                <div className="form-field">
                    <label>رقم التذكرة</label>

                    <input
                        className="input"
                        dir="ltr"
                        value={form.ticket_number}
                        onChange={(e) =>
                            update("ticket_number", e.target.value)
                        }
                        placeholder="607-2231889001"
                    />
                </div>

                <div className="form-field">
                    <label>رمز الحجز PNR</label>

                    <input
                        className="input"
                        dir="ltr"
                        value={form.pnr}
                        onChange={(e) =>
                            update("pnr", e.target.value.toUpperCase())
                        }
                        placeholder="IY7X4Q"
                    />
                </div>

                {/* شركة الطيران / رقم الرحلة */}
                <div className="form-field">
                    <label>شركة الطيران</label>

                    <input
                        className={`input ${errors.airline ? "has-error" : ""}`}
                        value={form.airline}
                        onChange={(e) =>
                            update("airline", e.target.value)
                        }
                        placeholder="Yemenia"
                    />

                    {errors.airline && (
                        <span className="form-error">
                            {errors.airline}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label>رقم الرحلة</label>

                    <input
                        className={`input ${errors.flight_number ? "has-error" : ""}`}
                        dir="ltr"
                        value={form.flight_number}
                        onChange={(e) =>
                            update("flight_number", e.target.value.toUpperCase())
                        }
                        placeholder="IY601"
                    />

                    {errors.flight_number && (
                        <span className="form-error">
                            {errors.flight_number}
                        </span>
                    )}
                </div>

                {/* المغادرة */}
                <div className="booking-form-section full-width">
                    <h3>بيانات المغادرة</h3>
                </div>

                <div className="form-field">
                    <label>مدينة المغادرة</label>

                    <input
                        className={`input ${errors.departure_city ? "has-error" : ""}`}
                        value={form.departure_city}
                        onChange={(e) =>
                            update("departure_city", e.target.value)
                        }
                        placeholder="عدن"
                    />

                    {errors.departure_city && (
                        <span className="form-error">
                            {errors.departure_city}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label>رمز المطار</label>

                    <input
                        className="input"
                        dir="ltr"
                        maxLength={3}
                        value={form.departure_airport_code}
                        onChange={(e) =>
                            update(
                                "departure_airport_code",
                                e.target.value.toUpperCase()
                            )
                        }
                        placeholder="ADE"
                    />
                </div>

                <div className="form-field full-width">
                    <label>اسم المطار</label>

                    <input
                        className="input"
                        value={form.departure_airport_name}
                        onChange={(e) =>
                            update(
                                "departure_airport_name",
                                e.target.value
                            )
                        }
                        placeholder="مطار عدن الدولي"
                    />
                </div>

                <div className="form-field">
                    <label>تاريخ ووقت المغادرة</label>

                    <input
                        className={`input ${errors.departure_datetime ? "has-error" : ""
                            }`}
                        type="datetime-local"
                        value={form.departure_datetime}
                        onChange={(e) =>
                            update("departure_datetime", e.target.value)
                        }
                    />

                    {errors.departure_datetime && (
                        <span className="form-error">
                            {errors.departure_datetime}
                        </span>
                    )}
                </div>

                {/* الوصول */}
                <div className="booking-form-section full-width">
                    <h3>بيانات الوصول</h3>
                </div>

                <div className="form-field">
                    <label>مدينة الوصول</label>

                    <input
                        className={`input ${errors.arrival_city ? "has-error" : ""}`}
                        value={form.arrival_city}
                        onChange={(e) =>
                            update("arrival_city", e.target.value)
                        }
                        placeholder="القاهرة"
                    />

                    {errors.arrival_city && (
                        <span className="form-error">
                            {errors.arrival_city}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label>رمز المطار</label>

                    <input
                        className="input"
                        dir="ltr"
                        maxLength={3}
                        value={form.arrival_airport_code}
                        onChange={(e) =>
                            update(
                                "arrival_airport_code",
                                e.target.value.toUpperCase()
                            )
                        }
                        placeholder="CAI"
                    />
                </div>

                <div className="form-field full-width">
                    <label>اسم المطار</label>

                    <input
                        className="input"
                        value={form.arrival_airport_name}
                        onChange={(e) =>
                            update(
                                "arrival_airport_name",
                                e.target.value
                            )
                        }
                        placeholder="مطار القاهرة الدولي"
                    />
                </div>

                <div className="form-field">
                    <label>تاريخ ووقت الوصول</label>

                    <input
                        className={`input ${errors.arrival_datetime ? "has-error" : ""
                            }`}
                        type="datetime-local"
                        value={form.arrival_datetime}
                        onChange={(e) =>
                            update("arrival_datetime", e.target.value)
                        }
                    />

                    {errors.arrival_datetime && (
                        <span className="form-error">
                            {errors.arrival_datetime}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label>نوع الرحلة</label>

                    <select
                        className="input"
                        value={form.trip_type}
                        onChange={(e) =>
                            update("trip_type", e.target.value)
                        }
                    >
                        <option value="One Way">ذهاب فقط</option>
                        <option value="Round Trip">ذهاب وعودة</option>
                    </select>
                </div>

                {/* السعر / الدرجة / الحالة */}
                <div className="form-field">
                    <label>السعر</label>

                    <input
                        className={`input ${errors.price ? "has-error" : ""}`}
                        type="number"
                        min="0"
                        step="0.01"
                        dir="ltr"
                        value={form.price}
                        onChange={(e) =>
                            update("price", e.target.value)
                        }
                        placeholder="420"
                    />

                    {errors.price && (
                        <span className="form-error">
                            {errors.price}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label>العملة</label>

                    <select
                        className="input"
                        value={form.currency}
                        onChange={(e) =>
                            update("currency", e.target.value)
                        }
                    >
                        <option value="USD">USD — دولار أمريكي</option>
                        <option value="SAR">SAR — ريال سعودي</option>
                        <option value="AED">AED — درهم إماراتي</option>
                        <option value="TRY">TRY — ليرة تركية</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>درجة التذكرة</label>

                    <select
                        className="input"
                        value={form.ticket_class}
                        onChange={(e) =>
                            update("ticket_class", e.target.value)
                        }
                    >
                        <option value="Economy">اقتصادية</option>
                        <option value="Business">رجال أعمال</option>
                        <option value="First">الدرجة الأولى</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>حالة الحجز</label>

                    <select
                        className="input"
                        value={form.booking_status}
                        onChange={(e) =>
                            update("booking_status", e.target.value)
                        }
                    >
                        <option value="Pending">قيد الانتظار</option>
                        <option value="Confirmed">مؤكد</option>
                        <option value="Completed">مكتمل</option>
                        <option value="Cancelled">ملغي</option>
                    </select>
                </div>

                {/* Buttons */}
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
                                : "إضافة الحجز"}
                    </button>

                </div>

            </form>
        </Modal>
    )
}