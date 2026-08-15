import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { LayoutMetaProvider, useLayoutMeta } from "./layoutMeta"
import "./layout.css"

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { title, breadcrumb } = useLayoutMeta()

  return (
    <div className="admin-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="admin-main">
        <Header title={title} breadcrumb={breadcrumb} onMenu={() => setMobileOpen(true)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <LayoutMetaProvider>
      <Shell />
    </LayoutMetaProvider>
  )
}
