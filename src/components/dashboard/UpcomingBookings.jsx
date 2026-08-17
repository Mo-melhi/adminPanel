import { Link } from "react-router-dom"
import StatusBadge from "../common/StatusBadge"
import { formatDate, formatCurrency } from "../../utils/format"
import { Plane } from "lucide-react"

export default function UpcomingBookings({ bookings = [] }) {
  return (
    <section className="dashboard-card upcoming-card">
      <div className="dashboard-card-header">
        <div>
          <h2>الرحلات القادمة</h2>
          <p>أقرب الرحلات المجدولة</p>
        </div>

        <Link to="/bookings" className="dashboard-view-all">
          عرض الكل
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="dashboard-empty">
          لا توجد رحلات قادمة مجدولة.
        </div>
      ) : (
        <div className="upcoming-list">
          {bookings.map((b) => (
            <div className="upcoming-item" key={b.id}>

              <div className="upcoming-route">
                <div className="airport">
                  <strong>{b.departure_airport_code}</strong>
                  <span>{b.departure_city}</span>
                </div>

                <div className="route-line">
                  <Plane size={17} />
                </div>

                <div className="airport">
                  <strong>{b.arrival_airport_code}</strong>
                  <span>{b.arrival_city}</span>
                </div>
              </div>

              <div className="upcoming-info">
                <div>
                  <span className="upcoming-label">العميل</span>
                  <strong>
                    {b.full_name || "---"}
                  </strong>
                </div>

                <div>
                  <span className="upcoming-label">المغادرة</span>
                  <strong>{formatDate(b.departure_datetime)}</strong>
                </div>

                <div>
                  <span className="upcoming-label">السعر</span>
                  <strong>
                    {formatCurrency(b.price, b.currency)}
                  </strong>
                </div>

                <StatusBadge status={b.booking_status} />
              </div>

              <Link
                to={`/bookings/${b.id}`}
                className="upcoming-view"
              >
                عرض التفاصيل
              </Link>

            </div>
          ))}
        </div>
      )}
    </section>
  )
}