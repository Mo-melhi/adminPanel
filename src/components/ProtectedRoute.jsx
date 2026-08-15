import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LoadingState } from "./common/States"

/** Guards admin routes; redirects unauthenticated users to /login. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <LoadingState label="Checking your session…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
