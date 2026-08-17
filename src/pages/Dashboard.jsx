import { useEffect } from "react"
import { Users, Plane, Ticket, Bell } from "lucide-react"
import { useLayoutMeta } from "../components/layout/layoutMeta"
import { useApi } from "../hooks/useApi"
import { getDashboardStats } from "../api/dashboardApi"
import { getActivity } from "../api/notificationApi"
import StatCard from "../components/dashboard/StatCard"
import UpcomingBookings from "../components/dashboard/UpcomingBookings"
import ActivityFeed from "../components/dashboard/ActivityFeed"
import { LoadingState, ErrorState } from "../components/common/States"
import "./Dashboard.css"

export default function Dashboard() {
  const { setMeta } = useLayoutMeta()
  useEffect(() => {
    setMeta({
      title: "لوحة التحكم",
      breadcrumb: ["الرئيسية", "لوحة التحكم"]
    })
  }, [setMeta])

  const { data: stats, loading, error, reload } = useApi(getDashboardStats)
  const { data: activity } = useApi(getActivity)

  if (loading) return <LoadingState label="Loading dashboard" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="dashboard">

      {/* ================= STATISTICS ================= */}

      <section className="dashboard-stats">

        <StatCard
          label="إجمالي العملاء"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          tone="blue"
        />

        <StatCard
          label="إجمالي الحجوزات"
          value={stats.totalBookings.toLocaleString()}
          icon={Ticket}
          tone="green"
        />

        <StatCard
          label="الرحلات القادمة"
          value={stats.upcomingFlights.toLocaleString()}
          icon={Plane}
          tone="orange"
        />

        <StatCard
          label="الإشعارات الفاشلة"
          value={stats.notificationStats?.failed?.toLocaleString() || "0"}
          icon={Bell}
          tone="violet"
        />

      </section>


      {/* ================= DASHBOARD CONTENT ================= */}

      <section className="dashboard-panels">

        <ActivityFeed items={activity || []} />

        <UpcomingBookings
          bookings={stats.upcomingBookings || []}
        />

      </section>

    </div>
  )
}
