import apiClient, { USE_MOCK } from "./apiClient"
import { buildMockOverview, mockActivity, delay } from "../utils/mockData"

/**
 * Dashboard API.
 * Backend contract:
 *   GET /dashboard/overview
 *   GET /dashboard/activity
 */
export const dashboardApi = {
  async getOverview() {
    if (USE_MOCK) {
      await delay()
      return buildMockOverview()
    }
    const { data } = await apiClient.get("/dashboard/overview")
    return data
  },

  async getActivity() {
    if (USE_MOCK) {
      await delay()
      return mockActivity()
    }
    const { data } = await apiClient.get("/dashboard/activity")
    return data
  },
}

export const getDashboardStats = () => dashboardApi.getOverview();