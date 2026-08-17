import apiClient, { USE_MOCK } from "./apiClient"
import {
  buildMockOverview,
  mockActivity,
  delay,
} from "../utils/mockData"

/**
 * Normalize dashboard overview data so mock mode
 * follows the same contract as the real backend.
 */
function normalizeOverview(data) {
  return {
    ...data,

    upcomingBookings: Array.isArray(data?.upcomingBookings)
      ? data.upcomingBookings.map((booking) => ({
        ...booking,
        full_name:
          booking.full_name ||
          booking.customer_name ||
          "---",
      }))
      : [],
  }
}

/**
 * Normalize activity data into the shape expected
 * by ActivityFeed.
 */
function normalizeActivity(data) {
  const items = Array.isArray(data)
    ? data
    : data?.items || []

  return items.map((item) => ({
    ...item,

    type:
      item.type ||
      "reminder",

    customer_name:
      item.customer_name ||
      item.full_name ||
      "---",

    timestamp:
      item.timestamp ||
      item.sent_at ||
      null,
  }))
}

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

      const data = buildMockOverview()

      return normalizeOverview(data)
    }

    const { data } = await apiClient.get(
      "/dashboard/overview"
    )

    return normalizeOverview(data)
  },

  async getActivity() {
    if (USE_MOCK) {
      await delay()

      const data = mockActivity()

      return normalizeActivity(data)
    }

    const { data } = await apiClient.get(
      "/dashboard/activity"
    )

    return normalizeActivity(data)
  },
}

export const getDashboardStats = () =>
  dashboardApi.getOverview()