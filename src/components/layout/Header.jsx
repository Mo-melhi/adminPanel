import { useState, useRef, useEffect } from "react"
import { Menu, ChevronLeft, LogOut, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { initials } from "../../utils/format"

export default function Header({ title, breadcrumb = [], onMenu }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", onClick)

    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <header className="header">

      <div className="row gap-3" style={{ minWidth: 0 }}>

        <button
          className="header-menu"
          onClick={onMenu}
          aria-label="فتح القائمة"
        >
          <Menu size={20} />
        </button>

        <div style={{ minWidth: 0 }}>

          <div className="header-title">
            {title}
          </div>

          {breadcrumb.length > 0 && (
            <div className="breadcrumb">

              {breadcrumb.map((crumb, i) => (
                <span key={i} className="row" style={{ gap: 4 }}>

                  {i > 0 && <ChevronLeft size={13} />}

                  <span
                    className={
                      i === breadcrumb.length - 1 ? "" : "faint"
                    }
                  >
                    {crumb}
                  </span>

                </span>
              ))}

            </div>
          )}

        </div>

      </div>

      <div className="profile" ref={ref}>

        <button
          className="profile-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="قائمة المستخدم"
        >
          <span className="avatar">
            {initials(user?.name || "المدير")}
          </span>

          <span className="profile-name">
            {user?.name || "المدير"}
          </span>
        </button>

        {menuOpen && (
          <div className="profile-menu" role="menu">

            <div className="profile-menu-head">
              <div className="cell-primary">
                {user?.name || "المدير"}
              </div>

              <div className="text-xs muted">
                {user?.email || "admin@turbotravel.net"}
              </div>
            </div>

            <button
              className="profile-menu-item"
              role="menuitem"
            >
              <User size={16} />
              الملف الشخصي
            </button>

            <button
              className="profile-menu-item danger"
              role="menuitem"
              onClick={logout}
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>

          </div>
        )}

      </div>

    </header>
  )
}