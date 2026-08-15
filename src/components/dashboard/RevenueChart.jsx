import { useState } from "react"
import { formatCurrency } from "../../utils/format"

export default function RevenueChart({ data = [] }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="panel">
      <div className="panel-head">
        <h3 className="panel-title">Revenue Trend</h3>
        <span className="panel-sub">Last 12 months</span>
      </div>
      <div className="chart">
        <div className="chart-bars" role="img" aria-label="Monthly revenue bar chart">
          {data.map((d, i) => {
            const height = (d.value / max) * 100
            const active = hover === i
            return (
              <div
                key={d.label}
                className="chart-col"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {active && (
                  <span className="chart-tip">
                    {formatCurrency(d.value)}
                  </span>
                )}
                <div
                  className={`chart-bar ${active ? "is-active" : ""}`}
                  style={{ height: `${height}%` }}
                />
                <span className="chart-label">{d.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
