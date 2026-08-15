import apiClient, { USE_MOCK } from "./apiClient"
import { delay } from "../utils/mockData"

/**
 * Authentication API.
 * Backend contract: POST /auth/login -> { token, user }
 * (Adjust the endpoint path here if your backend differs — this is the only
 * place it needs to change.)
 */
export const authApi = {
  async login({ email, password }) {
    if (USE_MOCK) {
      await delay(600)
      if (!email || !password) {
        throw new Error("قم بإدخال البريد الإلكتروني وكلمة المرور.")
      }
      return {
        token: "mock.jwt.token",
        user: { id: 1, name: "Admin", email },
      }
    }
    const { data } = await apiClient.post("/auth/login", { email, password })
    return data
  },

  async me() {
    if (USE_MOCK) {
      await delay(200)
      return { id: 1, name: "Admin", email: "admin@turbotravel.net" }
    }
    const { data } = await apiClient.get("/auth/me")
    return data
  },
}
