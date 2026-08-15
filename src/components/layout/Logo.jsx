export default function Logo({ compact = false }) {
  return (
    <img
      src="/logo.png"
      alt="Turbo Travel"
      className={`tt-logo ${compact ? "tt-logo--compact" : ""}`}
    />
  )
}