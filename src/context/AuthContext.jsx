import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"

import { authApi } from "../api/authApi"
import {
  getToken,
  setToken,
  clearToken,
} from "../api/apiClient"

const AuthContext = createContext(null)

const USER_KEY = "tt_admin_user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw =
        localStorage.getItem(USER_KEY)

      return raw
        ? JSON.parse(raw)
        : null
    } catch {
      return null
    }
  })

  const [initializing, setInitializing] =
    useState(true)

  /*
   * There is no /me endpoint in the backend.
   *
   * Authentication persistence is therefore based on
   * the stored JWT + stored frontend user information.
   */
  useEffect(() => {
    const token = getToken()

    if (!token) {
      setInitializing(false)
      return
    }

    setInitializing(false)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const {
        token,
        user: loggedInUser,
      } = await authApi.login(credentials)

      setToken(token)

      setUser(loggedInUser)

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedInUser)
      )

      return loggedInUser
    },
    []
  )

  const logout = useCallback(() => {
    clearToken()

    localStorage.removeItem(USER_KEY)

    setUser(null)
  }, [])

  const value = {
    user,

    isAuthenticated:
      Boolean(getToken()),

    initializing,

    login,

    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx =
    useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    )
  }

  return ctx
}