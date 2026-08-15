import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./components/layout/AdminLayout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import Bookings from "./pages/Bookings"
import BookingDetails from "./pages/BookingDetails"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"
import CustomerDetails from "./pages/CustomerDetails"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route
          path="/customers/:id"
          element={<CustomerDetails />}
        />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
