import { useEffect, useMemo, useState } from "react"
import {
    Bell,
    CheckCircle2,
    XCircle,
    Clock,
    Send,
    Search,
    MessageCircle,
} from "lucide-react"

import { usePageMeta } from "../components/layout/layoutMeta"
import { notificationApi } from "../api/notificationApi"
import { bookingApi } from "../api/bookingApi"

import ConfirmDialog from "../components/common/ConfirmDialog"
import { LoadingState, ErrorState, EmptyState } from "../components/common/States"
import Pagination from "../components/common/Pagination"

import "./Notifications.css"

const PAGE_SIZE = 5

const STATUS_FILTERS = [
    { key: "all", label: "الكل" },
    { key: "sent", label: "تم الإرسال" },
    { key: "failed", label: "فشل" },
]

function statusLabel(status) {
    if (status === "sent") return "تم الإرسال"
    if (status === "failed") return "فشل الإرسال"
    return status || "غير معروف"
}

function formatNotificationDate(value) {
    if (!value) return "—"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return "—"

    return date.toLocaleString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function Notifications() {
    usePageMeta(
        "الإشعارات",
        ["الرئيسية", "الإشعارات"]
    )

    const [notifications, setNotifications] = useState([])
    const [bookings, setBookings] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState("all")
    const [page, setPage] = useState(1)

    const [reminderBooking, setReminderBooking] = useState(null)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [sending, setSending] = useState(false)

    const [successMessage, setSuccessMessage] = useState("")
    const [actionError, setActionError] = useState("")

    async function loadData() {
        setLoading(true)
        setError(null)

        try {
            const [
                notificationData,
                bookingData,
            ] = await Promise.all([
                notificationApi.history(),
                bookingApi.list(),
            ])

            setNotifications(notificationData || [])
            setBookings(bookingData || [])
        } catch (err) {
            setError(
                err.message ||
                "تعذر تحميل الإشعارات"
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const enrichedNotifications = useMemo(() => {
        return notifications.map((notification) => {
            const booking = bookings.find(
                (b) =>
                    Number(b.id) ===
                    Number(notification.booking_id)
            )

            return {
                ...notification,
                booking,

                customerName:
                    notification.customer_name ||
                    notification.full_name ||
                    booking?.full_name ||
                    "---",

                flightNumber:
                    notification.flight_number ||
                    booking?.flight_number ||
                    "---",
            }
        })
    }, [notifications, bookings])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()

        return enrichedNotifications.filter(
            (notification) => {
                const matchesStatus =
                    filter === "all" ||
                    notification.status === filter

                const matchesQuery =
                    !q ||
                    notification.customerName
                        ?.toLowerCase()
                        .includes(q) ||
                    notification.flightNumber
                        ?.toLowerCase()
                        .includes(q) ||
                    notification.booking?.pnr
                        ?.toLowerCase()
                        .includes(q) ||
                    notification.booking?.ticket_number
                        ?.toLowerCase()
                        .includes(q)

                return (
                    matchesStatus &&
                    matchesQuery
                )
            }
        )
    }, [
        enrichedNotifications,
        query,
        filter,
    ])

    const pageCount = Math.max(
        1,
        Math.ceil(
            filtered.length / PAGE_SIZE
        )
    )

    const pageItems = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    useEffect(() => {
        setPage(1)
    }, [query, filter])

    async function handleSendReminder() {
        if (!reminderBooking) return

        setSending(true)
        setActionError("")
        setSuccessMessage("")

        try {
            const result =
                await notificationApi.sendReminder(
                    reminderBooking.id
                )

            if (!result?.success) {
                throw new Error(
                    "تعذر إرسال التذكير"
                )
            }

            setSuccessMessage(
                `تم إرسال تذكير واتساب إلى ${reminderBooking.customerName ||
                "العميل"
                } بنجاح`
            )

            setReminderBooking(null)

            // Reload notification history
            const updated =
                await notificationApi.history()

            setNotifications(updated || [])

            // Automatically remove the message later
            setTimeout(() => {
                setSuccessMessage("")
            }, 4000)
        } catch (err) {
            setActionError(
                err.message ||
                "تعذر إرسال تذكير واتساب"
            )
        } finally {
            setSending(false)
        }
    }

    function getBookingCustomer(booking) {
        return {
            ...booking,

            customerName:
                booking.full_name ||
                "غير معروف",

            customerPhone:
                booking.whatsapp_number ||
                booking.phone ||
                "",
        }
    }

    if (loading) {
        return <LoadingState />
    }

    if (error) {
        return (
            <ErrorState
                title="تعذر تحميل الإشعارات"
                message={error}
            />
        )
    }

    return (
        <div
            className="notifications-page"
            dir="rtl"
        >
            {/* Page header */}

            <div className="notifications-header">
                <div>
                    <h1>الإشعارات والتذكيرات</h1>

                    <p>
                        إدارة تذكيرات الرحلات ومتابعة
                        سجل إشعارات واتساب.
                    </p>
                </div>

                <div className="notification-summary">
                    <div className="notification-summary-icon">
                        <Bell size={19} />
                    </div>

                    <div>
                        <strong>
                            {notifications.length}
                        </strong>

                        <span>
                            آخر الإشعارات
                        </span>
                    </div>
                </div>
            </div>

            {/* Success message */}

            {successMessage && (
                <div
                    className="notification-alert success"
                    role="status"
                >
                    <CheckCircle2 size={18} />
                    <span>
                        {successMessage}
                    </span>
                </div>
            )}

            {actionError && (
                <div
                    className="notification-alert error"
                    role="alert"
                >
                    <XCircle size={18} />
                    <span>
                        {actionError}
                    </span>

                    <button
                        onClick={() =>
                            setActionError("")
                        }
                    >
                        إغلاق
                    </button>
                </div>
            )}

            {/* Reminder section */}

            <section className="reminder-panel card">
                <div className="reminder-panel-icon">
                    <MessageCircle size={24} />
                </div>

                <div className="reminder-panel-content">
                    <h2>
                        إرسال تذكير واتساب
                    </h2>

                    <p>
                        اختر حجزًا لإرسال تذكير
                        للعميل قبل موعد الرحلة.
                    </p>
                </div>

                <div className="reminder-panel-action">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setActionError("")
                            setPickerOpen(true)
                        }}
                    >
                        <Send size={16} />
                        إرسال تذكير
                    </button>
                </div>
            </section>

            {/* History */}

            <section className="notifications-history card">
                <div className="notifications-toolbar">
                    <div className="filter-tabs">
                        {STATUS_FILTERS.map(
                            (item) => (
                                <button
                                    key={
                                        item.key
                                    }
                                    className={`filter-tab ${filter ===
                                        item.key
                                        ? "is-active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setFilter(
                                            item.key
                                        )
                                    }
                                >
                                    {item.label}
                                </button>
                            )
                        )}
                    </div>

                    <div className="notification-search">
                        <Search size={16} />

                        <input
                            value={query}
                            onChange={(e) =>
                                setQuery(
                                    e.target.value
                                )
                            }
                            placeholder="البحث بالعميل أو الرحلة أو PNR..."
                        />
                    </div>
                </div>

                {pageItems.length === 0 ? (
                    <EmptyState
                        title="لا توجد إشعارات"
                        text="لم يتم العثور على إشعارات مطابقة للبحث أو الفلتر."
                    />
                ) : (
                    <>
                        <div className="notifications-list">
                            {pageItems.map(
                                (notification) => (
                                    <NotificationRow
                                        key={
                                            notification.id
                                        }
                                        notification={
                                            notification
                                        }
                                    />
                                )
                            )}
                        </div>

                        <Pagination
                            page={page}
                            pageCount={pageCount}
                            total={filtered.length}
                            onPageChange={
                                setPage
                            }
                        />
                    </>
                )}
            </section>

            {/* Reminder picker */}

            <ReminderPicker
                bookings={bookings
                    .filter(
                        (booking) =>
                            booking.booking_status !==
                            "Completed" &&
                            booking.booking_status !==
                            "Cancelled"
                    )
                    .map(getBookingCustomer)}
                open={pickerOpen}
                onClose={() =>
                    setPickerOpen(false)
                }
                onSelect={(booking) => {
                    setPickerOpen(false)
                    setReminderBooking(booking)
                }}
            />

            {/* Confirmation */}

            <ConfirmDialog
                open={Boolean(
                    reminderBooking
                )}
                onClose={() =>
                    !sending &&
                    setReminderBooking(
                        null
                    )
                }
                onConfirm={
                    handleSendReminder
                }
                loading={sending}
                danger={false}
                title="إرسال تذكير واتساب"
                message={
                    reminderBooking
                        ? `هل تريد إرسال تذكير واتساب إلى ${reminderBooking.customerName} بخصوص الرحلة ${reminderBooking.flight_number || ""}؟`
                        : ""
                }
                confirmLabel={
                    sending
                        ? "جارٍ الإرسال..."
                        : "إرسال التذكير"
                }
            />
        </div>
    )
}

/* --------------------------------------------------
   Notification row
-------------------------------------------------- */

function NotificationRow({
    notification,
}) {
    const isSent =
        notification.status === "sent"

    return (
        <div className="notification-row">
            <div
                className={`notification-status-icon ${isSent
                    ? "is-sent"
                    : "is-failed"
                    }`}
            >
                {isSent ? (
                    <CheckCircle2
                        size={19}
                    />
                ) : (
                    <XCircle
                        size={19}
                    />
                )}
            </div>

            <div className="notification-main">
                <div className="notification-main-top">
                    <strong>
                        {notification.customerName}
                    </strong>

                    <span
                        className={`notification-status ${isSent
                            ? "sent"
                            : "failed"
                            }`}
                    >
                        {statusLabel(
                            notification.status
                        )}
                    </span>
                </div>

                <div className="notification-details">
                    <span>
                        الرحلة{" "}
                        <strong dir="ltr">
                            {notification.flightNumber ||
                                "—"}
                        </strong>
                    </span>

                    {notification.booking?.pnr && (
                        <span>
                            PNR{" "}
                            <strong dir="ltr">
                                {
                                    notification
                                        .booking
                                        .pnr
                                }
                            </strong>
                        </span>
                    )}

                    <span>
                        {formatNotificationDate(
                            notification.sent_at
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}

/* --------------------------------------------------
   Reminder picker
-------------------------------------------------- */

function ReminderPicker({
    bookings,
    open,
    onClose,
    onSelect,
}) {
    if (!open) return null

    return (
        <div
            className="reminder-picker-overlay"
            onMouseDown={onClose}
        >
            <div
                className="reminder-picker card"
                dir="rtl"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="reminder-picker-header">
                    <div>
                        <h2>
                            اختر الحجز
                        </h2>

                        <p>
                            اختر الرحلة التي تريد
                            إرسال تذكير بشأنها.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={onClose}
                        aria-label="إغلاق"
                    >
                        ×
                    </button>
                </div>

                <div className="reminder-bookings">
                    {bookings.length ===
                        0 ? (
                        <p className="muted">
                            لا توجد حجوزات متاحة
                            لإرسال تذكير.
                        </p>
                    ) : (
                        bookings.map(
                            (booking) => (
                                <button
                                    type="button"
                                    key={
                                        booking.id
                                    }
                                    className="reminder-booking"
                                    onClick={() =>
                                        onSelect(
                                            booking
                                        )
                                    }
                                >
                                    <div>
                                        <strong>
                                            {
                                                booking.customerName
                                            }
                                        </strong>

                                        <span>
                                            {
                                                booking.airline
                                            }{" "}
                                            ·{" "}
                                            <b dir="ltr">
                                                {
                                                    booking.flight_number
                                                }
                                            </b>
                                        </span>
                                    </div>

                                    <div
                                        className="reminder-booking-route"
                                        dir="ltr"
                                    >
                                        {
                                            booking.departure_airport_code
                                        }

                                        <span>
                                            →
                                        </span>

                                        {
                                            booking.arrival_airport_code
                                        }
                                    </div>
                                </button>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    )
}