import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

import { useLayoutMeta } from "../components/layout/layoutMeta"
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerApi"

import Avatar from "../components/common/Avatar"
import StatusBadge from "../components/common/StatusBadge"
import SearchInput from "../components/common/SearchInput"
import Pagination from "../components/common/Pagination"
import CustomerFormModal from "../components/customers/CustomerFormModal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import { LoadingState, ErrorState, EmptyState } from "../components/common/States"
import { formatDate } from "../utils/format"

import "../styles/table.css"

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "active", label: "نشط" },
  { key: "vip", label: "VIP" },
  { key: "inactive", label: "غير نشط" },
]

const PAGE_SIZE = 5

export default function Customers() {
  const { setMeta } = useLayoutMeta()

  useEffect(() => {
    setMeta({
      title: "العملاء",
      breadcrumb: ["الرئيسية", "العملاء"],
    })
  }, [setMeta])

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (e) {
      setError(e.message || "تعذر تحميل العملاء")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesFilter =
        filter === "all" || c.status === filter

      const q = query.trim().toLowerCase()

      const matchesQuery =
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)

      return matchesFilter && matchesQuery
    })
  }, [customers, filter, query])

  const totalPages = Math.max(
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

  async function handleSubmit(form) {
    if (editing) {
      const updated = await updateCustomer(editing.id, form)

      setCustomers((cs) =>
        cs.map((c) =>
          c.id === editing.id ? updated : c
        )
      )
    } else {
      const created = await createCustomer(form)

      setCustomers((cs) => [created, ...cs])
    }

    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleting) return

    await deleteCustomer(deleting.id)

    setCustomers((cs) =>
      cs.filter((c) => c.id !== deleting.id)
    )

    setDeleting(null)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />
  }

  return (
    <div className="page customers-page">

      {/* ================= HEADER / TOOLBAR ================= */}

      <div className="page-toolbar">

        <div className="toolbar-left">

          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-tab ${
                  filter === f.key ? "is-active" : ""
                }`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="البحث عن عميل..."
          />

        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus size={17} />
          إضافة عميل
        </button>

      </div>


      {/* ================= CUSTOMERS TABLE ================= */}

      <div className="table-card">

        {pageItems.length === 0 ? (

          <EmptyState
            title="لم يتم العثور على عملاء"
            text="حاول تغيير البحث أو الفلاتر."
          />

        ) : (

          <>

            <div className="table-scroll">

              <table className="data-table">

                <thead>
                  <tr>
                    <th>العميل</th>
                    <th>رقم الهاتف</th>
                    <th>الدولة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>

                <tbody>

                  {pageItems.map((c) => (

                    <tr key={c.id}>

                      <td>
                        <div className="cell-user">

                          <Avatar name={c.name} />

                          <div>
                            <div className="cell-primary">
                              {c.name}
                            </div>

                            <div className="cell-sub">
                              {c.email}
                            </div>
                          </div>

                        </div>
                      </td>

                      <td className="mono">
                        {c.phone}
                      </td>

                      <td>
                        {c.country}
                      </td>


                      <td>
                        <StatusBadge status={c.status} />
                      </td>

                      <td>

                        <div className="row-actions">

                          <Link
                            to={`/customers/${c.id}`}
                            className="icon-btn"
                            aria-label={`عرض ${c.name}`}
                            title="عرض"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            className="icon-btn"
                            aria-label={`تعديل ${c.name}`}
                            title="تعديل"
                            onClick={() => {
                              setEditing(c)
                              setFormOpen(true)
                            }}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-btn danger"
                            aria-label={`حذف ${c.name}`}
                            title="حذف"
                            onClick={() => setDeleting(c)}
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


            {/* ================= PAGINATION ================= */}

            <div className="table-foot">

              <span className="foot-count">
                عرض {pageItems.length} من {filtered.length} عميل
              </span>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />

            </div>

          </>

        )}

      </div>


      {/* ================= CUSTOMER FORM ================= */}

      {formOpen && (
        <CustomerFormModal
          open={formOpen}
          initial={editing}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSubmit={handleSubmit}
        />
      )}


      {/* ================= DELETE CONFIRMATION ================= */}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="حذف العميل"
        message={`هل أنت متأكد من رغبتك في حذف ${deleting?.name}؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />

    </div>
  )
}