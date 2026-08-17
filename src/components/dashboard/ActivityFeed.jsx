import { UserPlus, CalendarCheck, XCircle, CreditCard, Bell } from "lucide-react"
import { formatRelative } from "../../utils/format"

const ICONS = {
  customer: UserPlus,
  booking: CalendarCheck,
  cancel: XCircle,
  payment: CreditCard,
  reminder: Bell,
  system: Bell,
}

export default function ActivityFeed({ items = [] }) {
  return (
    <section className="dashboard-card activity-card">
      <div className="dashboard-card-header">
        <div>
          <h2>النشاط الأخير</h2>
          <p>آخر العمليات والتحديثات</p>
        </div>
      </div>

      <div className="activity-list">
        {items.length === 0 ? (
          <div className="dashboard-empty">
            لا توجد أنشطة حديثة.
          </div>
        ) : (
          items.map((item) => {
            const Icon = Bell

            return (
              <div className="activity-item" key={item.id}>
                <div className="activity-icon activity-icon-reminder">
                  <Icon size={18} />
                </div>

                <div className="activity-content">
                  <div className="activity-message">
                    {item.status === "sent"
                      ? `تم إرسال تذكير للرحلة إلى ${item.full_name || "---"}`
                      : item.status === "failed"
                        ? `فشل إرسال تذكير للرحلة إلى ${item.full_name || "---"}`
                        : `تحديث على الحجز ${item.pnr || item.ticket_number || item.booking_id || "---"}`}
                  </div>

                  <div className="activity-time">
                    {formatRelative(item.sent_at)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}