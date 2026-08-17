import apiClient, { USE_MOCK } from "./apiClient"
import { delay } from "../utils/mockData"

/**
 * Authentication API.
 *
 * Real backend:
 *   POST /api/admin/login
 *
 * Request:
 *   { username, password }
 *
 * Response:
 *   { message, token }
 */
export const authApi = {
  async login({ username, password }) {
    if (USE_MOCK) {
      await delay(600)

      if (!username || !password) {
        throw new Error(
          "قم بإدخال اسم المستخدم وكلمة المرور."
        )
      }

      return {
        token: "mock.jwt.token",
        user: {
          username,
        },
      }
    }

    const { data } = await apiClient.post(
      "/admin/login",
      {
        username,
        password,
      }
    )

    return {
      token: data.token,
      user: {
        username,
      },
    }
  },
}