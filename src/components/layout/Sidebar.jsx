import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Ticket,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import Logo from "./Logo"
import { useAuth } from "../../context/AuthContext"
import { initials } from "../../utils/format"

const NAV = [
  { to: "/", label: "لوحة التحكم", icon: LayoutDashboard, end: true },
  { to: "/customers", label: "العملاء", icon: Users },
  { to: "/bookings", label: "الحجوزات", icon: Ticket },
  { to: "/notifications", label: "الإشعارات", icon: Bell },
  { to: "/settings", label: "الإعدادات", icon: Settings },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      <div
        className={`sidebar-scrim ${mobileOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>

        <div className="sidebar-top">
          <Logo />
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section">الرئيسية</p>

          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <span className="avatar">
              {initials(user?.name || "المدير")}
            </span>

            <div className="grow" style={{ minWidth: 0 }}>
              <div className="sidebar-user-name">
                {user?.name || "المدير"}
              </div>

              <div className="sidebar-user-email">
                {user?.email || "admin@turbotravel.net"}
              </div>
            </div>
          </div>

          <button className="nav-link nav-logout" onClick={logout}>
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>

      </aside>
    </>
  )
}