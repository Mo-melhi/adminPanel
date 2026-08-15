export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  loading,
}) {
  return (
    <div className={`stat-card tone-${tone}`}>

      <div className="stat-card-top">
        <span className="stat-card-label">
          {label}
        </span>

        <div className="stat-card-icon">
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
      </div>

      <div className="stat-card-value">
        {loading ? (
          <div
            className="skeleton"
            style={{
              height: 32,
              width: 55,
            }}
          />
        ) : (
          value
        )}
      </div>

    </div>
  )
}