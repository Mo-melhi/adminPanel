import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Pagination({
    page,
    pageCount,
    totalPages,
    total,
    onPageChange,
    onChange,
}) {
    const handlePageChange = onPageChange || onChange
    const pages = pageCount ?? totalPages ?? 1

    if (pages <= 0) return null

    return (
        <div
            className="row between wrap gap-3"
            style={{
                padding: "14px 20px",
                borderTop: "1px solid var(--border)",
            }}
            dir="rtl"
        >
            <span className="text-sm muted">
                الصفحة {page} من {pages}
                {total != null && ` · ${total} إجمالي`}
            </span>

            <div className="row gap-2">
                <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                        handlePageChange?.(page - 1)
                    }
                    disabled={
                        page <= 1 ||
                        !handlePageChange
                    }
                >
                    <ChevronRight size={16} />
                    السابقة
                </button>

                <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                        handlePageChange?.(page + 1)
                    }
                    disabled={
                        page >= pages ||
                        !handlePageChange
                    }
                >
                    التالية
                    <ChevronLeft size={16} />
                </button>
            </div>
        </div>
    )
}