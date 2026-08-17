import apiClient, { USE_MOCK } from "./apiClient"
import { mockCustomers, delay } from "../utils/mockData"

/**
 * Customer API — CRUD.
 * Backend contract:
 *   GET    /customers
 *   GET    /customers/:id
 *   POST   /customers
 *   PUT    /customers/:id
 *   DELETE /customers/:id
 */

// In-memory store used ONLY in mock mode so create/edit/delete feel real.
export let mockStore = [...mockCustomers]

export const customerApi = {
  async list() {
    if (USE_MOCK) {
      await delay()
      return [...mockStore]
    }
    const { data } = await apiClient.get("/customers")
    return data
  },

  async get(id) {
    if (USE_MOCK) {
      await delay(300)
      return mockStore.find((c) => c.id === Number(id)) || null
    }
    const { data } = await apiClient.get(`/customers/${id}`)
    return data
  },

  async create(payload) {
    if (USE_MOCK) {
      await delay(500)
      const created = {
        ...payload,
        id: Math.max(0, ...mockStore.map((c) => c.id)) + 1,
        created_at: new Date().toISOString(),
      }
      mockStore = [created, ...mockStore]
      return created
    }
    const { data } = await apiClient.post("/customers", payload)
    return data
  },

  async update(id, payload) {
    if (USE_MOCK) {
      await delay(500)
      mockStore = mockStore.map((c) => (c.id === Number(id) ? { ...c, ...payload } : c))
      return mockStore.find((c) => c.id === Number(id))
    }
    const { data } = await apiClient.put(`/customers/${id}`, payload)
    return data
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay(400)
      mockStore = mockStore.filter((c) => c.id !== Number(id))
      return { success: true }
    }
    const { data } = await apiClient.delete(`/customers/${id}`)
    return data
  },
}

export const getCustomers = () => customerApi.list();

export const createCustomer = (payload) =>
    customerApi.create(payload);

export const updateCustomer = (id, payload) =>
    customerApi.update(id, payload);

export const deleteCustomer = (id) =>
    customerApi.remove(id);

export const getCustomer = (id) =>
  customerApi.get(id);