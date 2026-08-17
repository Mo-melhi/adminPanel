import { useState } from "react"
import { useNavigate, useLocation, Navigate } from "react-router-dom"
import { Plane, Lock, User, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { normalizeError } from "../hooks/useApi"
import { USE_MOCK } from "../api/apiClient"
import "./Login.css"

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await login({ username, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(normalizeError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page" dir="rtl">

      {/* ==================== HERO ==================== */}
      <section className="login-hero">
        <div className="login-hero-inner">

          <div>
            <div className="login-hero-logo">
              <img src="/logo.png" alt="Turbo Travel" />
            </div>

            <div className="login-hero-copy">
              <div className="login-hero-mark">
                <Plane size={26} />
              </div>

              <h2>
                لوحة تحكم تيربو ترافل
              </h2>

              <p>
                قم بإدارة العملاء والحجوزات وتذكيرات الرحلات
                من خلال لوحة تحكم واحدة.
                إدارة رحلاتك أصبحت أسهل وأكثر تنظيمًا.
              </p>
            </div>
          </div>

          <div className="login-hero-stats">

            <div>
              <strong>الحجوزات</strong>
              <span>تتبع جميع الرحلات</span>
            </div>

            <div>
              <strong>التذكيرات</strong>
              <span>واتساب في الوقت المناسب</span>
            </div>

            <div>
              <strong>العملاء</strong>
              <span>كل شيء في مكان واحد</span>
            </div>

          </div>

        </div>
      </section>

      {/* ==================== LOGIN FORM ==================== */}
      <main className="login-form-side">
        <div className="login-card">

          <h1 className="login-title">
            تسجيل دخول المسؤول
          </h1>

          <p className="login-subtitle">
            أدخل بيانات الدخول للوصول إلى لوحة التحكم.
          </p>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Username */}
            <div className="field">
              <label
                className="field-label"
                htmlFor="username"
              >
                اسم المستخدم
              </label>

              <div className="search login-input-wrapper">
                <User size={16} />

                <input
                  id="username"
                  className="input"
                  type="text"
                  dir="ltr"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label
                className="field-label"
                htmlFor="password"
              >
                كلمة المرور
              </label>

              <div className="search login-input-wrapper">
                <Lock size={16} />

                <input
                  id="password"
                  className="input"
                  type="password"
                  dir="ltr"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={submitting}
              style={{ marginTop: 8 }}
            >
              {submitting && (
                <span
                  className="spinner"
                  style={{
                    borderTopColor: "#fff",
                    width: 16,
                    height: 16,
                  }}
                />
              )}

              {submitting
                ? "جارٍ تسجيل الدخول…"
                : "تسجيل الدخول"}
            </button>

          </form>

          {USE_MOCK && (
            <p className="login-hint">
              وضع المعاينة — لا يوجد اتصال بالخادم حاليًا.
              أدخل أي اسم مستخدم وكلمة مرور لاستكشاف لوحة التحكم.
            </p>
          )}

        </div>
      </main>

    </div>
  )
}