"use client"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/auth.css"

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    userType: "cliente", 
    professionalInfo: {
      specialties: [],
      certification: "",
      bio: "",
    },
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [showProfessionalFields, setShowProfessionalFields] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [showApprovalPopup, setShowApprovalPopup] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === "userType") {
      setShowProfessionalFields(value === "profesional")
    }

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked })
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.lastname.trim()) newErrors.lastname = "El apellido es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    if (!formData.password) newErrors.password = "La contraseña es requerida"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmá tu contraseña"
    if (!formData.telephone.trim()) newErrors.telephone = "El teléfono es requerido"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "Debés aceptar los términos y condiciones"
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (formData.userType === "profesional") {
      if (!formData.professionalInfo.certification) {
        newErrors["professionalInfo.certification"] = "La certificación es requerida"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const transformFormData = () => {
    const { name, lastname, email, password, telephone, userType } = formData;
    const { specialties, certification, bio } = formData.professionalInfo;
  
    const baseData = {
      name,
      lastname,
      email,
      password,
      telephone,
      userType,
    };
  
    if (userType === "profesional") {
      const profesionalData = {
        ...baseData, specialties, certification, bio
      };    
      return profesionalData;
    }
  
    return baseData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      if (formData.userType === "profesional") {        
        setShowApprovalPopup(true)
        return
      }
      
      const result = await register(transformFormData())
      if (result.success) {
        setRegistrationSuccess(true)
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } else {
        setErrors({ submit: result.error })
      }
    }
  }

  const handleProfessionalConfirm = async () => {
    const result = await register(transformFormData())
    if (result.success) {
      setShowApprovalPopup(false)
      setRegistrationSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } else {
      setErrors({ submit: result.error })
      setShowApprovalPopup(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="registration-success">
              <div className="success-icon">✓</div>
              <h2>¡Registro Exitoso!</h2>
              <p>Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión en unos segundos.</p>
              <Link to="/login" className="auth-submit-btn">
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">Completá el formulario para registrarte</p>
          </div>

          {errors.submit && <div className="auth-error-message">{errors.submit}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Apellido</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={errors.lastname ? "error" : ""}
                />
                {errors.lastname && <span className="error-message">{errors.lastname}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Teléfono</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="+54 9 3624 123456"
                className={errors.telephone ? "error" : ""}
              />
              {errors.telephone && <span className="error-message">{errors.telephone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="userType">Tipo de Usuario</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="cliente">Cliente</option>
                <option value="profesional">Profesional</option>
              </select>
            </div>

            {showProfessionalFields && (
              <div className="professional-fields">
                <h3>Información Profesional</h3>

                <div className="form-group">
                  <label htmlFor="certification">Certificaciones</label>
                  <input
                    type="text"
                    id="certification"
                    name="professionalInfo.certification"
                    value={formData.professionalInfo.certification}
                    onChange={handleChange}
                    className={errors["professionalInfo.certification"] ? "error" : ""}
                  />
                  {errors["professionalInfo.certification"] && (
                    <span className="error-message">{errors["professionalInfo.certification"]}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Biografía</label>
                  <textarea
                    id="bio"
                    name="professionalInfo.bio"
                    value={formData.professionalInfo.bio}
                    onChange={handleChange}
                    rows={4}
                  ></textarea>
                </div>
              </div>
            )}

            <div className="terms-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <label className="checkbox-label">
                  Acepto los{" "}
                  <Link to="/terms" className="terms-link">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link to="/privacy" className="terms-link">
                    Política de Privacidad
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            <button type="submit" className="auth-submit-btn">
              Registrarme
            </button>
          </form>

          <div className="auth-footer">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login" className="auth-link">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
      
      {/* Professional Approval Popup */}
      {showApprovalPopup && (
        <div className="approval-popup-overlay">
          <div className="approval-popup">
            <div className="approval-popup-header">
              <h2>Información Importante</h2>
            </div>
            <div className="approval-popup-content">
              <div className="approval-icon">ℹ️</div>
              <p>Tu cuenta de profesional será enviada para aprobación por parte del administrador.</p>
              <p>Una vez que tu cuenta sea aprobada, recibirás un correo electrónico de confirmación.</p>
              <p>¿Deseas continuar con el registro?</p>
            </div>
            <div className="approval-popup-footer">
              <button 
                className="approval-popup-btn cancel" 
                onClick={() => setShowApprovalPopup(false)}
              >
                Cancelar
              </button>
              <button 
                className="approval-popup-btn confirm" 
                onClick={handleProfessionalConfirm}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Register
