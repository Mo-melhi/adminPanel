import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authApi } from "../api/authApi"
import { getToken, setToken, clearToken } from "../api/apiClient"

/**
 * Authentication state lives here — never inside page components.
 * The JWT is persisted in localStorage (via apiClient helpers) and the Axios
 * request interceptor attaches it automatically to every request.
 */
const AuthContext = createContext(null)

const USER_KEY = "tt_admin_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [initializing, setInitializing] = useState(true)

  // On first load, if we have a token but no user, try to resolve the session.
  useEffect(() => {
    const token = getToken()
    if (token && !user) {
      authApi
        .me()
        .then((u) => {
          setUser(u)
          localStorage.setItem(USER_KEY, JSON.stringify(u))
        })
        .catch(() => {
          clearToken()
          localStorage.removeItem(USER_KEY)
        })
        .finally(() => setInitializing(false))
    } else {
      setInitializing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (credentials) => {
    const { token, user: loggedInUser } = await authApi.login(credentials)
    setToken(token)
    setUser(loggedInUser)
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser))
    return loggedInUser
  }, [])

  const logout = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user && getToken()),
    initializing,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
