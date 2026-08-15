const COLORS = ["#007db4", "#f5a623", "#22a05f", "#7c5cfc", "#d64545", "#0e9aa7"]

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function Avatar({ name, size = 38 }) {
  const idx = (name || "").length % COLORS.length
  return (
    <span
      className="avatar"
      style={{ background: COLORS[idx], width: size, height: size, fontSize: size * 0.37 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
