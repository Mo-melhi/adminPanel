import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react"

import { useLayoutMeta } from "../components/layout/layoutMeta"
import { bookingApi } from "../api/bookingApi"
import { customerApi } from "../api/customerApi"

import BookingFormModal from "../components/bookings/BookingFormModal"
import StatusBadge from "../components/common/StatusBadge"
import Pagination from "../components/common/Pagination"
import { LoadingState, ErrorState, EmptyState } from "../components/common/States"
import { formatDate, formatCurrency } from "../utils/format"
import ConfirmDialog from "../components/common/ConfirmDialog"

import "../styles/table.css"

const FILTERS = [
    { key: "all", label: "الكل" },
    { key: "confirmed", label: "مؤكد" },
    { key: "pending", label: "قيد الانتظار" },
    { key: "completed", label: "مكتمل" },
    { key: "cancelled", label: "ملغي" },
]

const PAGE_SIZE = 5

export default function Bookings() {
    const { setMeta } = useLayoutMeta()

    const [customers, setCustomers] = useState([])

    useEffect(() => {
        setMeta({
            title: "الحجوزات",
            breadcrumb: ["الرئيسية", "الحجوزات"],
        })
    }, [setMeta])
    useEffect(() => {
        async function loadCustomers() {
            try {
                const data = await customerApi.list()
                setCustomers(data)
            } catch (e) {
                console.error("Failed to load customers:", e)
            }
        }

        loadCustomers()
    }, [])

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)

    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState("all")
    const [page, setPage] = useState(1)

    async function load() {
        setLoading(true)
        setError(null)

        try {
            const data = await bookingApi.list()
            setBookings(data?.items || data || [])
        } catch (e) {
            setError(e.message || "فشل تحميل الحجوزات")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const filtered = useMemo(() => {
        return bookings.filter((b) => {
            const status = String(
                b.booking_status || ""
            ).toLowerCase()

            const matchesFilter =
                filter === "all" ||
                status === filter

            const q = query.trim().toLowerCase()

            const customerName =
                customers.find(
                    (c) => Number(c.id) === Number(b.customer_id)
                )?.full_name || ""

            const matchesQuery =
                !q ||
                String(b.pnr || "")
                    .toLowerCase()
                    .includes(q) ||
                customerName
                    .toLowerCase()
                    .includes(q) ||
                String(b.flight_number || "")
                    .toLowerCase()
                    .includes(q) ||
                String(b.departure_city || "")
                    .toLowerCase()
                    .includes(q) ||
                String(b.arrival_city || "")
                    .toLowerCase()
                    .includes(q)

            return matchesFilter && matchesQuery
        })
    }, [bookings, customers, filter, query])

    const pageCount = Math.max(
        1,
        Math.ceil(filtered.length / PAGE_SIZE)
    )

    const pageItems = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    useEffect(() => {
        setPage(1)
    }, [filter, query])

    async function handleDelete() {
        if (!deleting) return

        try {
            await bookingApi.remove(deleting.id)

            setBookings((current) =>
                current.filter(
                    (booking) => booking.id !== deleting.id
                )
            )

            setDeleting(null)
        } catch (e) {
            alert(e.message || "فشل حذف الحجز")
        }
    }

    if (loading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState message={error} onRetry={load} />
    }

    async function handleSubmit(form) {
        if (editing) {
            const updated = await bookingApi.update(
                editing.id,
                form
            )

            setBookings((current) =>
                current.map((booking) =>
                    booking.id === editing.id
                        ? updated
                        : booking
                )
            )
        } else {
            const created = await bookingApi.create(form)

            setBookings((current) => [
                created,
                ...current,
            ])
        }
    }

    return (
        <div className="page" dir="rtl">

            {/* Toolbar */}
            <div className="page-toolbar">

                <div className="toolbar-left">

                    {/* Filters */}
                    <div className="filter-tabs">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                className={`filter-tab ${filter === f.key ? "is-active" : ""
                                    }`}
                                onClick={() => setFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="booking-search">
                        <Search size={17} />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="البحث عن حجز..."
                        />
                    </div>

                </div>

                {/* Add booking */}
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditing(null)
                        setFormOpen(true)
                    }}
                >
                    <Plus size={18} />
                    إضافة حجز
                </button>

            </div>


            {/* Table */}
            <div className="table-card">

                {pageItems.length === 0 ? (

                    <EmptyState
                        title="لا توجد حجوزات"
                        text="لم يتم العثور على أي حجوزات مطابقة."
                    />

                ) : (

                    <>

                        <div className="table-scroll">

                            <table className="data-table">

                                <thead>
                                    <tr>
                                        <th>رمز الحجز</th>
                                        <th>العميل</th>
                                        <th>الرحلة</th>
                                        <th>المغادرة</th>
                                        <th>تاريخ الرحلة</th>
                                        <th>السعر</th>
                                        <th>الحالة</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {pageItems.map((b) => (

                                        <tr key={b.id}>

                                            {/* Reference */}
                                            <td>
                                                <div className="cell-primary booking-reference">
                                                    {b.pnr || `#${b.id}`}
                                                </div>

                                                {b.ticket_number && (
                                                    <div className="cell-sub" dir="ltr">
                                                        {b.ticket_number}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Customer */}
                                            <td>
                                                <div className="cell-primary">
                                                    {
                                                        customers.find(
                                                            (c) => Number(c.id) === Number(b.customer_id)
                                                        )?.full_name || 
                                                        customers.find(
                                                            (c) => Number(c.id) === Number(b.customer_id)
                                                        )?.name ||
                                                        "—"
                                                    }
                                                </div>
                                            </td>

                                            {/* Flight */}
                                            <td>
                                                <div className="cell-primary" dir="ltr">
                                                    {b.flight_number || "—"}
                                                </div>

                                                <div className="cell-sub">
                                                    {b.airline || "—"}
                                                </div>
                                            </td>

                                            {/* Route */}
                                            <td>
                                                <div className="booking-route">
                                                    <strong>{b.departure_city || "—"}</strong>

                                                    <span className="route-arrow">
                                                        ←
                                                    </span>

                                                    <strong>{b.arrival_city || "—"}</strong>
                                                </div>

                                                <div className="cell-sub">
                                                    {b.departure_airport_code || "—"}
                                                    {" → "}
                                                    {b.arrival_airport_code || "—"}
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="cell-sub" dir="ltr">
                                                {b.departure_datetime
                                                    ? formatDate(b.departure_datetime)
                                                    : "—"}
                                            </td>

                                            {/* Price */}
                                            <td className="booking-price" dir="ltr">
                                                {b.price != null
                                                    ? formatCurrency(
                                                        b.price,
                                                        b.currency || "USD"
                                                    )
                                                    : "—"}
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <StatusBadge
                                                    status={b.booking_status}
                                                />
                                            </td>

                                            {/* Actions */}
                                            <td>

                                                <div className="row-actions">

                                                    <Link
                                                        to={`/bookings/${b.id}`}
                                                        className="icon-btn"
                                                        aria-label={`عرض الحجز ${b.reference || b.id
                                                            }`}
                                                    >
                                                        <Eye size={17} />
                                                    </Link>

                                                    <button
                                                        className="icon-btn"
                                                        aria-label="تعديل الحجز"
                                                        onClick={() => {
                                                            setEditing(b)
                                                            setFormOpen(true)
                                                        }}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        className="icon-btn danger"
                                                        aria-label="حذف الحجز"
                                                        onClick={() => setDeleting(b)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        <BookingFormModal
                            open={formOpen}
                            initial={editing}
                            customers={customers}
                            onClose={() => {
                                setFormOpen(false)
                                setEditing(null)
                            }}
                            onSubmit={handleSubmit}
                        />


                        {/* Pagination */}

                        <Pagination
                            page={page}
                            pageCount={pageCount}
                            total={filtered.length}
                            onPageChange={setPage}
                        />

                        {/* Confirm Dialog */}

                        <ConfirmDialog
                            open={Boolean(deleting)}
                            title="حذف الحجز"
                            message={`هل أنت متأكد من حذف الحجز ${deleting?.pnr || `#${deleting?.id}`
                                }؟ لا يمكن التراجع عن هذا الإجراء.`}
                            confirmLabel="حذف الحجز"
                            danger
                            onConfirm={handleDelete}
                            onClose={() => setDeleting(null)}
                        />

                    </>

                )}

            </div>

        </div>
    )
}