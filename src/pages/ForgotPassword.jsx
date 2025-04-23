"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/auth.css"
import { forgotPass } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsSending(true)

    try {
      await forgotPass(email);
      setMessage("Si este email está registrado, se han enviado instrucciones para recuperar tu contraseña.");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Ocurrió un error al intentar recuperar la contraseña.";
      setError(errorMsg);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Recuperar Contraseña</h1>
            <p className="auth-subtitle">
              Introducí tu email y recibirás instrucciones para recuperar tu contraseña.
            </p>
          </div>

          {error && <div className="auth-error-message">{error}</div>}
          {message && <div className="auth-success-message">{message}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="auth-submit-btn" disabled={isSending}>
              {isSending ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              <Link to="/login" className="auth-link">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
