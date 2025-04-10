"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockBookings } from "../../data/mockBookings"
import "../../styles/client.css"

const ClientDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isClient, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("bookings")
  const [bookings, setBookings] = useState([])
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [cancellationReason, setCancellationReason] = useState("")
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: null,
  })
  const [previewImage, setPreviewImage] = useState(null)

  // Redirect if not client
  useEffect(() => {
    if (!isClient) {
      navigate("/login")
    }
  }, [isClient, navigate])

  // Load user bookings
  useEffect(() => {
    if (currentUser) {
      // In a real app, this would be an API call
      const userBookings = mockBookings.filter((booking) => booking.userId === currentUser.id)
      setBookings(userBookings)

      // Set profile data
      setProfileData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        profilePicture: currentUser.profilePicture || null,
      })
    }
  }, [currentUser])

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Check if booking can be cancelled (24 hours in advance)
  const canCancelBooking = (booking) => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`)
    const now = new Date()
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60)
    return hoursDifference >= 24
  }

  // Open cancel modal
  const openCancelModal = (booking) => {
    setBookingToCancel(booking)
    setShowCancelModal(true)
  }

  // Handle booking cancellation
  const handleCancelBooking = () => {
    if (!bookingToCancel) return

    const canCancel = canCancelBooking(bookingToCancel)

    // Update booking status
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingToCancel.id
          ? {
              ...booking,
              status: "cancelled",
              cancellationReason,
              refundEligible: canCancel,
            }
          : booking,
      ),
    )

    // Close modal and reset state
    setShowCancelModal(false)
    setBookingToCancel(null)
    setCancellationReason("")

    // Show appropriate message
    if (canCancel) {
      if (bookingToCancel.paymentMethod === "transfer") {
        alert("Tu reserva ha sido cancelada. Recibirás un reembolso en los próximos días hábiles.")
      } else {
        alert("Tu reserva ha sido cancelada. El reembolso se procesará automáticamente.")
      }
    } else {
      if (bookingToCancel.paymentMethod === "transfer") {
        alert(
          "Tu reserva ha sido cancelada. Como la cancelación es con menos de 24 horas de anticipación, no se realizará reembolso.",
        )
      } else {
        alert(
          "Tu reserva ha sido cancelada. Como la cancelación es con menos de 24 horas de anticipación, se aplicará el cargo completo.",
        )
      }
    }
  }

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        // Actualizar el estado de profileData para incluir la imagen
        setProfileData({
          ...profileData,
          profilePicture: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault()

    const updatedUser = {
      ...currentUser,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
      profilePicture: previewImage || currentUser?.profilePicture,
    }

    updateUser(updatedUser)
    alert("Perfil actualizado correctamente")
    setShowProfileModal(false)
  }

  // Filter upcoming and past bookings
  const today = new Date().toISOString().split("T")[0]
  const upcomingBookings = bookings.filter(
    (booking) =>
      (booking.date > today || (booking.date === today && booking.time > new Date().toTimeString().slice(0, 5))) &&
      booking.status !== "cancelled",
  )
  const pastBookings = bookings.filter(
    (booking) =>
      booking.date < today ||
      (booking.date === today && booking.time < new Date().toTimeString().slice(0, 5)) ||
      booking.status === "cancelled",
  )

  return (
    <div className="client-dashboard">
      <div className="client-sidebar">
        <div className="client-sidebar-header">
          <h2>Mi Panel</h2>
          <div className="client-user-info">
            <div className="client-avatar">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture || "/placeholder.svg"} alt="Perfil" />
              ) : (
                <>
                  {currentUser?.firstName?.charAt(0)}
                  {currentUser?.lastName?.charAt(0)}
                </>
              )}
            </div>
            <div className="client-user-details">
              <p className="client-user-name">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="client-user-role">Cliente</p>
            </div>
          </div>
        </div>

        <nav className="client-nav">
          <button
            className={`client-nav-item ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <span className="client-nav-icon">📅</span>
            <span>Mis Reservas</span>
          </button>

          <button
            className={`client-nav-item ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            <span className="client-nav-icon">❤️</span>
            <span>Favoritos</span>
          </button>

          <button
            className={`client-nav-item ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <span className="client-nav-icon">📋</span>
            <span>Historial</span>
          </button>

          <button
            className={`client-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="client-nav-icon">👤</span>
            <span>Mi Perfil</span>
          </button>
        </nav>

        <div className="client-sidebar-footer">
          <button className="client-logout-btn" onClick={handleLogout}>
            <span className="client-nav-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="client-content">
        <div className="client-header">
          <h1 className="client-title">
            {activeTab === "bookings" && "Mis Reservas"}
            {activeTab === "favorites" && "Mis Favoritos"}
            {activeTab === "history" && "Mi Historial"}
            {activeTab === "profile" && "Mi Perfil"}
          </h1>
          <div className="client-header-actions">
            <button className="client-action-btn" title="Notificaciones">
              <span className="client-action-icon">🔔</span>
            </button>
            <button className="client-action-btn" title="Editar Perfil" onClick={() => setShowProfileModal(true)}>
              <span className="client-action-icon">⚙️</span>
            </button>
          </div>
        </div>

        <div className="client-main">
          {activeTab === "bookings" && (
            <div className="client-bookings">
              <div className="client-section">
                <h2 className="client-section-title">Próximas Reservas</h2>
                {upcomingBookings.length > 0 ? (
                  <div className="client-bookings-list">
                    {upcomingBookings.map((booking) => (
                      <div className="client-booking-card" key={booking.id}>
                        <div className="client-booking-date">
                          <div className="booking-date">{booking.date}</div>
                          <div className="booking-time">{booking.time}</div>
                        </div>
                        <div className="client-booking-details">
                          <h3 className="client-booking-service">{booking.serviceName}</h3>
                          <p className="client-booking-professional">Profesional: {booking.professionalName}</p>
                          <p className="client-booking-duration">Duración: {booking.duration}</p>
                        </div>
                        <div className="client-booking-status">
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status === "pending" && "Pendiente"}
                            {booking.status === "confirmed" && "Confirmada"}
                            {booking.status === "completed" && "Completada"}
                            {booking.status === "cancelled" && "Cancelada"}
                          </span>
                        </div>
                        <div className="client-booking-actions">
                          <button
                            className="client-booking-action-btn view"
                            onClick={() => alert(`Ver detalles de la reserva #${booking.id}`)}
                          >
                            Ver Detalles
                          </button>
                          {(booking.status === "pending" || booking.status === "confirmed") && (
                            <button
                              className="client-booking-action-btn cancel"
                              onClick={() => openCancelModal(booking)}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="client-no-data">No tienes reservas próximas</p>
                )}
              </div>

              <div className="client-section">
                <h2 className="client-section-title">Reservas Pasadas</h2>
                {pastBookings.length > 0 ? (
                  <div className="client-bookings-list">
                    {pastBookings.slice(0, 3).map((booking) => (
                      <div className="client-booking-card past" key={booking.id}>
                        <div className="client-booking-date">
                          <div className="booking-date">{booking.date}</div>
                          <div className="booking-time">{booking.time}</div>
                        </div>
                        <div className="client-booking-details">
                          <h3 className="client-booking-service">{booking.serviceName}</h3>
                          <p className="client-booking-professional">Profesional: {booking.professionalName}</p>
                          <p className="client-booking-duration">Duración: {booking.duration}</p>
                        </div>
                        <div className="client-booking-status">
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status === "pending" && "Pendiente"}
                            {booking.status === "confirmed" && "Confirmada"}
                            {booking.status === "completed" && "Completada"}
                            {booking.status === "cancelled" && "Cancelada"}
                          </span>
                        </div>
                        <div className="client-booking-actions">
                          <button
                            className="client-booking-action-btn view"
                            onClick={() => alert(`Ver detalles de la reserva #${booking.id}`)}
                          >
                            Ver Detalles
                          </button>
                          {booking.status === "completed" && (
                            <button
                              className="client-booking-action-btn review"
                              onClick={() => alert(`Dejar reseña para ${booking.serviceName}`)}
                            >
                              Dejar Reseña
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {pastBookings.length > 3 && (
                      <button className="client-view-all-btn" onClick={() => setActiveTab("history")}>
                        Ver todas las reservas pasadas
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="client-no-data">No tienes reservas pasadas</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="client-favorites">
              <p className="client-placeholder">No tienes servicios favoritos guardados</p>
              <div className="client-placeholder-actions">
                <Link to="/services" className="client-action-link">
                  Explorar Servicios
                </Link>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="client-history">
              <div className="client-section">
                <h2 className="client-section-title">Historial de Reservas</h2>
                {pastBookings.length > 0 ? (
                  <div className="client-bookings-list">
                    {pastBookings.map((booking) => (
                      <div className="client-booking-card past" key={booking.id}>
                        <div className="client-booking-date">
                          <div className="booking-date">{booking.date}</div>
                          <div className="booking-time">{booking.time}</div>
                        </div>
                        <div className="client-booking-details">
                          <h3 className="client-booking-service">{booking.serviceName}</h3>
                          <p className="client-booking-professional">Profesional: {booking.professionalName}</p>
                          <p className="client-booking-duration">Duración: {booking.duration}</p>
                        </div>
                        <div className="client-booking-status">
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status === "pending" && "Pendiente"}
                            {booking.status === "confirmed" && "Confirmada"}
                            {booking.status === "completed" && "Completada"}
                            {booking.status === "cancelled" && "Cancelada"}
                          </span>
                        </div>
                        <div className="client-booking-actions">
                          <button
                            className="client-booking-action-btn view"
                            onClick={() => alert(`Ver detalles de la reserva #${booking.id}`)}
                          >
                            Ver Detalles
                          </button>
                          {booking.status === "completed" && (
                            <button
                              className="client-booking-action-btn review"
                              onClick={() => alert(`Dejar reseña para ${booking.serviceName}`)}
                            >
                              Dejar Reseña
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="client-no-data">No tienes reservas pasadas</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="client-profile">
              <div className="client-profile-header">
                <div className="client-profile-avatar">
                  {currentUser?.profilePicture ? (
                    <img src={currentUser.profilePicture || "/placeholder.svg"} alt="Perfil" />
                  ) : (
                    <>
                      {currentUser?.firstName?.charAt(0)}
                      {currentUser?.lastName?.charAt(0)}
                    </>
                  )}
                </div>
                <div className="client-profile-info">
                  <h2 className="client-profile-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                  <p className="client-profile-role">Cliente</p>
                  <p className="client-profile-email">{currentUser?.email}</p>
                </div>
                <button className="client-edit-profile-btn" onClick={() => setShowProfileModal(true)}>
                  Editar Perfil
                </button>
              </div>

              <div className="client-profile-sections">
                <div className="client-profile-section">
                  <h3 className="client-section-title">Información Personal</h3>
                  <div className="client-profile-form">
                    <div className="client-form-group">
                      <label>Nombre</label>
                      <input type="text" value={currentUser?.firstName} readOnly />
                    </div>
                    <div className="client-form-group">
                      <label>Apellido</label>
                      <input type="text" value={currentUser?.lastName} readOnly />
                    </div>
                    <div className="client-form-group">
                      <label>Email</label>
                      <input type="email" value={currentUser?.email} readOnly />
                    </div>
                    <div className="client-form-group">
                      <label>Teléfono</label>
                      <input type="tel" value={currentUser?.phone || "+54 9 3624 123456"} readOnly />
                    </div>
                  </div>
                </div>

                <div className="client-profile-section">
                  <h3 className="client-section-title">Preferencias</h3>
                  <div className="client-preferences">
                    <div className="client-preference-item">
                      <label>Notificaciones por Email</label>
                      <div className="client-toggle">
                        <input type="checkbox" id="email-notifications" defaultChecked />
                        <label htmlFor="email-notifications"></label>
                      </div>
                    </div>
                    <div className="client-preference-item">
                      <label>Notificaciones por SMS</label>
                      <div className="client-toggle">
                        <input type="checkbox" id="sms-notifications" defaultChecked />
                        <label htmlFor="sms-notifications"></label>
                      </div>
                    </div>
                    <div className="client-preference-item">
                      <label>Recordatorios de Citas</label>
                      <div className="client-toggle">
                        <input type="checkbox" id="appointment-reminders" defaultChecked />
                        <label htmlFor="appointment-reminders"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && bookingToCancel && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <div className="client-modal-header">
              <h2>Cancelar Reserva</h2>
            </div>
            <div className="client-modal-content">
              <p>
                Estás por cancelar tu reserva para <strong>{bookingToCancel.serviceName}</strong> el día{" "}
                <strong>{bookingToCancel.date}</strong> a las <strong>{bookingToCancel.time}</strong>.
              </p>

              {canCancelBooking(bookingToCancel) ? (
                <div className="client-cancellation-notice success">
                  <p>
                    <strong>Aviso:</strong> Como estás cancelando con más de 24 horas de anticipación,
                    {bookingToCancel.paymentMethod === "transfer"
                      ? " podrás recibir un reembolso completo."
                      : " no se te realizará ningún cargo."}
                  </p>
                </div>
              ) : (
                <div className="client-cancellation-notice warning">
                  <p>
                    <strong>Aviso:</strong> Como estás cancelando con menos de 24 horas de anticipación,
                    {bookingToCancel.paymentMethod === "transfer"
                      ? " no podrás recibir un reembolso."
                      : " se te cobrará el importe completo del servicio."}
                  </p>
                </div>
              )}

              <div className="client-form-group">
                <label>Motivo de la cancelación:</label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Por favor, indícanos el motivo de la cancelación"
                  rows={4}
                ></textarea>
              </div>
            </div>
            <div className="client-modal-footer">
              <button
                className="client-modal-btn cancel"
                onClick={() => {
                  setShowCancelModal(false)
                  setBookingToCancel(null)
                  setCancellationReason("")
                }}
              >
                Volver
              </button>
              <button
                className="client-modal-btn confirm"
                onClick={handleCancelBooking}
                disabled={!cancellationReason.trim()}
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <div className="client-modal-header">
              <h2>Editar Perfil</h2>
            </div>
            <div className="client-modal-content">
              <form onSubmit={handleProfileUpdate}>
                <div className="client-profile-picture-upload">
                  <div className="client-profile-picture-preview">
                    {previewImage ? (
                      <img src={previewImage || "/placeholder.svg"} alt="Vista previa" />
                    ) : currentUser?.profilePicture ? (
                      <img src={currentUser.profilePicture || "/placeholder.svg"} alt="Perfil actual" />
                    ) : (
                      <div className="client-profile-picture-placeholder">
                        {currentUser?.firstName?.charAt(0)}
                        {currentUser?.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="client-profile-picture-actions">
                    <label className="client-upload-btn">
                      Cambiar Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={{ display: "none" }}
                      />
                    </label>
                    {(previewImage || currentUser?.profilePicture) && (
                      <button
                        type="button"
                        className="client-remove-photo-btn"
                        onClick={() => {
                          setPreviewImage(null)
                          setProfileData({ ...profileData, profilePicture: null })
                        }}
                      >
                        Quitar Foto
                      </button>
                    )}
                  </div>
                </div>

                <div className="client-form-row">
                  <div className="client-form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="client-form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="client-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="client-form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="client-modal-footer">
                  <button type="button" className="client-modal-btn cancel" onClick={() => setShowProfileModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="client-modal-btn save">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDashboard
