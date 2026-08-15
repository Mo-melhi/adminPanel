import { AlertTriangle, Inbox, RotateCw } from "lucide-react"

/** Full-block loading spinner. */
export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="state-text">{label}</p>
    </div>
  )
}

/** Error state with an optional retry action. */
export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="state">
      <span className="state-icon" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
        <AlertTriangle size={24} />
      </span>
      <p className="state-title">Unable to load data</p>
      <p className="state-text">{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          <RotateCw size={15} /> Try again
        </button>
      )}
    </div>
  )
}

/** Empty state with an optional action button. */
export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", text, action }) {
  return (
    <div className="state">
      <span className="state-icon">
        <Icon size={24} />
      </span>
      <p className="state-title">{title}</p>
      {text && <p className="state-text">{text}</p>}
      {action}
    </div>
  )
}

/** Table row skeletons. */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c}>
              <div className="skeleton" style={{ height: 14, width: c === 0 ? "70%" : "55%" }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
