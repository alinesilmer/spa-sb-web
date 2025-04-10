"use client"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/auth.css"

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Obtener la ruta de redirección si existe
  const from = location.state?.from || "/"

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      // Se pasan como argumentos separados (email, password)
      const response = await login(formData.email, formData.password)
      if (!response.success) {
        setError(response.error)
        return
      }
      const user = response.user
      // Redirigir según el rol del usuario
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.role === "professional") {
        navigate("/professional/dashboard")
      } else {
        // Si hay una ruta de redirección, usarla
        navigate(from)
      }
    } catch {
      setError("Error en el inicio de sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Iniciar Sesión</h1>
            <p className="auth-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          {error && <div className="auth-error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="checkbox-label">
                  Recordarme
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-divider">
            <span>O</span>
          </div>

          <div className="social-login">
            <button className="social-btn">
              <span className="social-icon">G</span>
              Continuar con Google
            </button>
          </div>

          <div className="auth-footer">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="auth-link">
              Regístrate
            </Link>
          </div>

          <div className="auth-demo-accounts">
            <p className="demo-title">Cuentas de demostración:</p>
            <ul className="demo-list">
              <li>Admin: admin@example.com / admin123</li>
              <li>Profesional: pro@example.com / pro123</li>
              <li>Cliente: user@example.com / user123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
