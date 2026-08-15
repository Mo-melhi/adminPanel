import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    ArrowRight,
    ArrowLeft,
    Pencil,
    Trash2,
    Plane,
    User,
    Ticket,
    MapPin,
    CalendarDays,
    Clock,
    CreditCard,
    Bell,
    Phone,
    Mail,
} from "lucide-react"

import { bookingApi } from "../api/bookingApi"
import { customerApi } from "../api/customerApi"
import { usePageMeta } from "../components/layout/layoutMeta"
import StatusBadge from "../components/common/StatusBadge"
import ConfirmDialog from "../components/common/ConfirmDialog"
import { LoadingState, ErrorState } from "../components/common/States"
import { formatCurrency, formatDateTime } from "../utils/format"

import "./BookingDetails.css"

function statusLabel(status) {
    const labels = {
        Confirmed: "مؤكد",
        Pending: "قيد الانتظار",
        Completed: "مكتمل",
        Cancelled: "ملغي",
    }

    return labels[status] || status || "غير معروف"
}

export default function BookingDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    usePageMeta("تفاصيل الحجز", ["الرئيسية", "الحجوزات", "تفاصيل الحجز"])

    const [booking, setBooking] = useState(null)
    const [customer, setCustomer] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        async function loadBooking() {
            setLoading(true)
            setError(null)

            try {
                const data = await bookingApi.get(id)

                if (!data) {
                    throw new Error("الحجز غير موجود")
                }

                setBooking(data)

                if (data.customer_id) {
                    const customerData =
                        await customerApi.get(data.customer_id)

                    setCustomer(customerData)
                }
            } catch (err) {
                setError(
                    err.message || "تعذر تحميل تفاصيل الحجز"
                )
            } finally {
                setLoading(false)
            }
        }

        loadBooking()
    }, [id])

    async function handleDelete() {
        if (!booking) return

        try {
            await bookingApi.remove(booking.id)
            navigate("/bookings", { replace: true })
        } catch (err) {
            setError(
                err.message || "تعذر حذف الحجز"
            )
            setDeleting(false)
        }
    }

    if (loading) {
        return <LoadingState />
    }

    if (error) {
        return (
            <div className="booking-details-page">
                <ErrorState
                    title="تعذر تحميل الحجز"
                    message={error}
                />

                <button
                    className="btn btn-outline"
                    onClick={() => navigate("/bookings")}
                >
                    العودة إلى الحجوزات
                </button>
            </div>
        )
    }

    if (!booking) {
        return null
    }

    return (
        <div
            className="booking-details-page"
            dir="rtl"
        >
            {/* Top bar */}
            <div className="booking-details-toolbar">
                <button
                    className="btn btn-outline"
                    onClick={() => navigate("/bookings")}
                >
                    <ArrowRight size={17} />
                    العودة إلى الحجوزات
                </button>

                <div className="booking-details-actions">
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate("/bookings")}
                    >
                        <Pencil size={16} />
                        تعديل الحجز
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={() => setDeleting(true)}
                    >
                        <Trash2 size={16} />
                        حذف الحجز
                    </button>
                </div>
            </div>

            {/* Header card */}
            <section className="booking-details-header card">
                <div className="booking-details-header-main">
                    <div className="booking-plane-icon">
                        <Plane size={25} />
                    </div>

                    <div>
                        <div className="booking-details-reference">
                            <span>رمز الحجز</span>

                            <strong dir="ltr">
                                {booking.pnr || `#${booking.id}`}
                            </strong>
                        </div>

                        <div className="booking-details-flight">
                            {booking.airline || "—"}

                            {booking.flight_number && (
                                <>
                                    <span>•</span>

                                    <strong dir="ltr">
                                        {booking.flight_number}
                                    </strong>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <StatusBadge
                    status={booking.booking_status}
                >
                    {statusLabel(booking.booking_status)}
                </StatusBadge>
            </section>

            {/* Route */}
            <section className="flight-route-card card">
                <div className="route-location">
                    <span className="route-code" dir="ltr">
                        {booking.departure_airport_code || "—"}
                    </span>

                    <strong>
                        {booking.departure_city || "—"}
                    </strong>

                    <span className="route-airport">
                        {booking.departure_airport_name || "—"}
                    </span>

                    <span
                        className="route-date"
                        dir="ltr"
                    >
                        {booking.departure_datetime
                            ? formatDateTime(
                                  booking.departure_datetime
                              )
                            : "—"}
                    </span>
                </div>

                <div className="route-middle">
                    <div className="route-line" />

                    <div className="route-plane">
                        <Plane size={18} />
                    </div>

                    <div className="route-line" />
                </div>

                <div className="route-location arrival">
                    <span className="route-code" dir="ltr">
                        {booking.arrival_airport_code || "—"}
                    </span>

                    <strong>
                        {booking.arrival_city || "—"}
                    </strong>

                    <span className="route-airport">
                        {booking.arrival_airport_name || "—"}
                    </span>

                    <span
                        className="route-date"
                        dir="ltr"
                    >
                        {booking.arrival_datetime
                            ? formatDateTime(
                                  booking.arrival_datetime
                              )
                            : "—"}
                    </span>
                </div>
            </section>

            <div className="booking-details-grid">
                {/* Customer */}
                <section className="details-card card">
                    <div className="details-card-title">
                        <User size={18} />
                        <h2>بيانات العميل</h2>
                    </div>

                    {customer ? (
                        <div className="customer-details">
                            <div className="customer-avatar">
                                {(customer.full_name || "؟")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="customer-details-info">
                                <strong>
                                    {customer.full_name || "—"}
                                </strong>

                                {customer.phone && (
                                    <div>
                                        <Phone size={14} />
                                        <span dir="ltr">
                                            {customer.phone}
                                        </span>
                                    </div>
                                )}

                                {customer.email && (
                                    <div>
                                        <Mail size={14} />
                                        <span dir="ltr">
                                            {customer.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="details-empty">
                            لم يتم العثور على بيانات العميل
                        </p>
                    )}
                </section>

                {/* Ticket */}
                <section className="details-card card">
                    <div className="details-card-title">
                        <Ticket size={18} />
                        <h2>بيانات التذكرة</h2>
                    </div>

                    <div className="details-list">
                        <DetailRow
                            label="رقم التذكرة"
                            value={booking.ticket_number}
                            ltr
                        />

                        <DetailRow
                            label="رمز الحجز PNR"
                            value={booking.pnr}
                            ltr
                        />

                        <DetailRow
                            label="شركة الطيران"
                            value={booking.airline}
                        />

                        <DetailRow
                            label="رقم الرحلة"
                            value={booking.flight_number}
                            ltr
                        />

                        <DetailRow
                            label="درجة التذكرة"
                            value={
                                {
                                    Economy: "اقتصادية",
                                    Business: "رجال أعمال",
                                    First: "الدرجة الأولى",
                                }[
                                    booking.ticket_class
                                ] ||
                                booking.ticket_class
                            }
                        />

                        <DetailRow
                            label="نوع الرحلة"
                            value={
                                booking.trip_type ===
                                "Round Trip"
                                    ? "ذهاب وعودة"
                                    : "ذهاب فقط"
                            }
                        />
                    </div>
                </section>

                {/* Schedule */}
                <section className="details-card card">
                    <div className="details-card-title">
                        <CalendarDays size={18} />
                        <h2>مواعيد الرحلة</h2>
                    </div>

                    <div className="details-list">
                        <DetailRow
                            label="المغادرة"
                            value={
                                booking.departure_datetime
                                    ? formatDateTime(
                                          booking.departure_datetime
                                      )
                                    : "—"
                            }
                            ltr
                        />

                        <DetailRow
                            label="الصعود للطائرة"
                            value={
                                booking.boarding_datetime
                                    ? formatDateTime(
                                          booking.boarding_datetime
                                      )
                                    : "—"
                            }
                            ltr
                        />

                        <DetailRow
                            label="الوصول"
                            value={
                                booking.arrival_datetime
                                    ? formatDateTime(
                                          booking.arrival_datetime
                                      )
                                    : "—"
                            }
                            ltr
                        />
                    </div>
                </section>

                {/* Payment */}
                <section className="details-card card">
                    <div className="details-card-title">
                        <CreditCard size={18} />
                        <h2>الدفع</h2>
                    </div>

                    <div className="price-display">
                        <span>قيمة الحجز</span>

                        <strong dir="ltr">
                            {booking.price != null
                                ? formatCurrency(
                                      booking.price,
                                      booking.currency ||
                                          "USD"
                                  )
                                : "—"}
                        </strong>
                    </div>

                    <div className="details-list">
                        <DetailRow
                            label="العملة"
                            value={booking.currency}
                            ltr
                        />

                        <DetailRow
                            label="حالة الحجز"
                            value={statusLabel(
                                booking.booking_status
                            )}
                        />
                    </div>
                </section>

                {/* Reminder */}
                <section className="details-card card reminder-card">
                    <div className="details-card-title">
                        <Bell size={18} />
                        <h2>تذكير الرحلة</h2>
                    </div>

                    <div className="reminder-status">
                        <div
                            className={`reminder-icon ${
                                booking.reminder_sent
                                    ? "sent"
                                    : "pending"
                            }`}
                        >
                            <Bell size={20} />
                        </div>

                        <div>
                            <strong>
                                {booking.reminder_sent
                                    ? "تم إرسال التذكير"
                                    : "لم يتم إرسال التذكير"}
                            </strong>

                            <p>
                                {booking.reminder_sent
                                    ? "تم إرسال تذكير الرحلة للعميل."
                                    : "يمكن إرسال التذكير للعميل قبل الرحلة."}
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={booking.reminder_sent}
                    >
                        <Bell size={16} />

                        {booking.reminder_sent
                            ? "تم إرسال التذكير"
                            : "إرسال تذكير واتساب"}
                    </button>
                </section>
            </div>

            <ConfirmDialog
                open={deleting}
                title="حذف الحجز"
                message={`هل أنت متأكد من حذف الحجز ${
                    booking.pnr ||
                    `#${booking.id}`
                }؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmLabel="حذف الحجز"
                danger
                onConfirm={handleDelete}
                onClose={() => setDeleting(false)}
            />
        </div>
    )
}

function DetailRow({ label, value, ltr = false }) {
    return (
        <div className="detail-row">
            <span>{label}</span>

            <strong dir={ltr ? "ltr" : undefined}>
                {value || "—"}
            </strong>
        </div>
    )
}