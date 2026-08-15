/* Formatting helpers shared across the app. */

export function formatDate(iso, opts = {}) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d)) return "—"
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  })
}

export function formatDateTime(iso) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d)) return "—"
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatTime(iso) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d)) return "—"
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

/** Human-friendly departure label: "Today, 7:00 PM" / "Tomorrow, 9:00 AM" / "Mar 12, 2:30 PM" */
export function formatDeparture(iso) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d)) return "—"
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  const time = formatTime(iso)
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`
  return `${formatDate(iso)}, ${time}`
}

export function formatCurrency(amount, currency = "USD") {
  if (amount == null || amount === "") return "—"
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(amount))
  } catch {
    return `${amount} ${currency}`
  }
}

/** Relative time: "2 minutes ago", "3 hours ago", "just now". */
export function timeAgo(iso) {
  if (!iso) return ""
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 30) return "just now"
  if (diff < 60) return `${diff} seconds ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
  return formatDate(iso)
}

export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("")
}

/** Map a booking status to a badge variant. */
export function bookingStatusVariant(status = "") {
  const s = status.toLowerCase()
  if (s === "confirmed") return "success"
  if (s === "pending") return "warning"
  if (s === "cancelled" || s === "canceled") return "danger"
  if (s === "completed") return "info"
  return "neutral"
}

export function isUpcoming(booking) {
  if (!booking?.departure_datetime) return false
  return new Date(booking.departure_datetime) >= new Date()
}

export function formatRelative(iso) {
    return timeAgo(iso)
}