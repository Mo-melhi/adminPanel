import { bookingStatusVariant } from "../../utils/format"

const STATUS_LABELS = {
    Confirmed: "مؤكد",
    Pending: "قيد الانتظار",
    Completed: "مكتمل",
    Cancelled: "ملغي",
}

export default function StatusBadge({
    variant,
    status,
    children,
    dot = true,
}) {
    const resolved =
        variant || bookingStatusVariant(status)

    const label =
        children ||
        STATUS_LABELS[status] ||
        status ||
        "غير معروف"

    return (
        <span className={`badge badge-${resolved}`}>
            {dot && (
                <span
                    className="dot"
                    aria-hidden="true"
                />
            )}

            {label}
        </span>
    )
}