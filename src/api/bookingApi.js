import apiClient, { USE_MOCK } from "./apiClient"
import { mockBookings, delay } from "../utils/mockData"
import { mockStore as customerStore } from "./customerApi"

/**
 * Booking API — CRUD.
 * Backend contract:
 *   GET    /bookings
 *   GET    /bookings/:id
 *   POST   /bookings
 *   PUT    /bookings/:id
 *   DELETE /bookings/:id
 */

let mockStore = [...mockBookings]

// Attach a resolved customer name for display convenience. If the backend
// already returns a nested customer object, adapt this in one place.
function withCustomerName(b) {
  const customer = customerStore.find(
    (c) => c.id === Number(b.customer_id)
  )

  return {
    ...b,
    customer_name:
      customer?.full_name ||
      customer?.name ||
      "---",
  }
}

export const bookingApi = {
  async list() {
    if (USE_MOCK) {
      await delay()
      return mockStore.map(withCustomerName)
    }
    const { data } = await apiClient.get("/bookings")
    return data
  },

  async get(id) {
    if (USE_MOCK) {
      await delay(300)
      const found = mockStore.find((b) => b.id === Number(id))
      return found ? withCustomerName(found) : null
    }
    const { data } = await apiClient.get(`/bookings/${id}`)
    return data
  },

  async create(payload) {
    if (USE_MOCK) {
      await delay(500)
      const created = {
        ...payload,
        id: Math.max(0, ...mockStore.map((b) => b.id)) + 1,
        reminder_sent: false,
        created_at: new Date().toISOString(),
      }
      mockStore = [created, ...mockStore]
      return withCustomerName(created)
    }
    const { data } = await apiClient.post("/bookings", payload)
    return data
  },

  async update(id, payload) {
    if (USE_MOCK) {
      await delay(500)
      mockStore = mockStore.map((b) => (b.id === Number(id) ? { ...b, ...payload } : b))
      return withCustomerName(mockStore.find((b) => b.id === Number(id)))
    }
    const { data } = await apiClient.put(`/bookings/${id}`, payload)
    return data
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay(400)
      mockStore = mockStore.filter((b) => b.id !== Number(id))
      return { success: true }
    }
    const { data } = await apiClient.delete(`/bookings/${id}`)
    return data
  },
}

export const getBookings = () => bookingApi.list();