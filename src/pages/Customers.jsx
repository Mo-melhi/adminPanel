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
import SearchInput from "../components/common/SearchInput"
import Pagination from "../components/common/Pagination"
import CustomerFormModal from "../components/customers/CustomerFormModal"
import ConfirmDialog from "../components/common/ConfirmDialog"
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/common/States"

import "../styles/table.css"

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

  /*
   * Search customers by the fields that actually exist
   * in the backend customer model.
   */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return customers

    return customers.filter((customer) => {
      return (
        customer.full_name?.toLowerCase().includes(q) ||
        customer.phone?.toLowerCase().includes(q) ||
        customer.whatsapp_number?.toLowerCase().includes(q) ||
        customer.passport_number?.toLowerCase().includes(q) ||
        customer.nationality?.toLowerCase().includes(q) ||
        customer.notes?.toLowerCase().includes(q)
      )
    })
  }, [customers, query])

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  /*
   * Return to page 1 whenever the search changes.
   */
  useEffect(() => {
    setPage(1)
  }, [query])

  /*
   * Prevent an invalid page after deleting customers
   * or changing the search results.
   */
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  async function handleSubmit(form) {
    if (editing) {
      const updated = await updateCustomer(
        editing.id,
        form
      )

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editing.id
            ? updated
            : customer
        )
      )
    } else {
      const created = await createCustomer(form)

      setCustomers((current) => [
        created,
        ...current,
      ])
    }

    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete() {
    if (!deleting) return

    await deleteCustomer(deleting.id)

    setCustomers((current) =>
      current.filter(
        (customer) =>
          customer.id !== deleting.id
      )
    )

    setDeleting(null)
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={load}
      />
    )
  }

  return (
    <div className="page customers-page">

      {/* ================= HEADER / TOOLBAR ================= */}

      <div className="page-toolbar">

        <div className="toolbar-left">

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
            text="حاول تغيير البحث."
          />

        ) : (

          <>

            <div className="table-scroll">

              <table className="data-table">

                <thead>
                  <tr>
                    <th>العميل</th>
                    <th>رقم الهاتف</th>
                    <th>الجنسية</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>

                <tbody>

                  {pageItems.map((customer) => (

                    <tr key={customer.id}>

                      {/* العميل */}

                      <td>
                        <div className="cell-user">

                          <Avatar
                            name={customer.full_name}
                          />

                          <div>

                            <div className="cell-primary">
                              {customer.full_name}
                            </div>

                            <div className="cell-sub">
                              جواز السفر:{" "}
                              {customer.passport_number}
                            </div>

                          </div>

                        </div>
                      </td>

                      {/* الهاتف */}

                      <td className="mono">
                        {customer.phone}
                      </td>

                      {/* الجنسية */}

                      <td>
                        {customer.nationality}
                      </td>

                      {/* الإجراءات */}

                      <td>

                        <div className="row-actions">

                          <Link
                            to={`/customers/${customer.id}`}
                            className="icon-btn"
                            aria-label={`عرض ${customer.full_name}`}
                            title="عرض"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            className="icon-btn"
                            aria-label={`تعديل ${customer.full_name}`}
                            title="تعديل"
                            onClick={() => {
                              setEditing(customer)
                              setFormOpen(true)
                            }}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-btn danger"
                            aria-label={`حذف ${customer.full_name}`}
                            title="حذف"
                            onClick={() =>
                              setDeleting(customer)
                            }
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
                عرض {pageItems.length} من{" "}
                {filtered.length} عميل
              </span>

              <Pagination
                page={page}
                totalPages={totalPages}
                total={filtered.length}
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
        message={`هل أنت متأكد من رغبتك في حذف ${deleting?.full_name}؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />

    </div>
  )
}