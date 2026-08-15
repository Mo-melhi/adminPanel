import axios from "axios"

/**
 * Centralized Axios client.
 *
 * The base URL is read ONLY from the VITE_API_URL environment variable.
 * Configure it in a `.env` file at the project root, e.g.:
 *
 *   VITE_API_URL=http://localhost:5000/api
 *
 * Every API module in `src/api` imports this single instance so that the
 * base URL, headers, and auth token handling live in exactly one place.
 */

export const API_URL = import.meta.env.VITE_API_URL || ""

/**
 * When no backend URL is configured we run in "mock mode" so the UI can be
 * developed and previewed without a live server. The mock data lives entirely
 * in `src/utils/mockData.js` and is only referenced by the api modules through
 * the `USE_MOCK` flag — remove that flag (or set VITE_API_URL) to hit the real
 * Express backend. No component ever touches mock data directly.
 */
export const USE_MOCK = !API_URL

const TOKEN_KEY = "tt_admin_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
})

/* Request interceptor: attach the JWT to every authenticated request. */
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* Response interceptor: on 401 clear the token and bounce to login. */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
