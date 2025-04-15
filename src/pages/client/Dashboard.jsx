"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockBookings, getBookings } from "../../data/mockBookings"
import "../../styles/client.css"
import SimpleModal from "../../components/SimpleModal"

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
  })
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef(null)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (!isClient) {
      navigate("/login")
    }
  }, [isClient, navigate])

  useEffect(() => {
    if (currentUser) {      
      //const userBookings = mockBookings.filter((booking) => booking.userId === currentUser.id)

      const getUserBookings = async () =>{
        const authToken = localStorage.getItem('authToken')
        const userBookings =  await getBookings(currentUser.id, authToken)
        console.log(JSON.stringify(userBookings));
          setBookings(userBookings.length > 0 ? userBookings : [])
      }

      getUserBookings();
      
      setProfileData({
        firstName: currentUser.name || "",
        lastName: currentUser.lastname || "",
        email: currentUser.email || "",
        phone: currentUser.telephone || "",
      })
    }
  }, [currentUser])

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificationsRef])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const openDetailsModal = (booking) => {
    setSelectedBookingDetails(booking)
    setShowDetailsModal(true)
  }

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`)
    const now = new Date()
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60)
    return hoursDifference >= 24
  }

  const openCancelModal = (booking) => {
    setBookingToCancel(booking)
    setShowCancelModal(true)
  }

  const handleCancelBooking = () => {
    if (!bookingToCancel) return
    const canCancel = canCancelBooking(bookingToCancel)
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingToCancel.id
          ? {
              ...booking,
              status: "cancelado",
              cancellationReason,
              refundEligible: canCancel,
            }
          : booking,
      ),
    )
    setShowCancelModal(false)
    setBookingToCancel(null)
    setCancellationReason("")

    // Mostrar modal de éxito en lugar de alert
    setSuccessMessage(
      canCancel
        ? bookingToCancel.paymentMethod === "transfer"
          ? "Tu reserva ha sido cancelada. Recibirás un reembolso en los próximos días hábiles."
          : "Tu reserva ha sido cancelada. El reembolso se procesará automáticamente."
        : bookingToCancel.paymentMethod === "transfer"
          ? "Tu reserva ha sido cancelada. Como la cancelación es con menos de 24 horas de anticipación, no se realizará reembolso."
          : "Tu reserva ha sido cancelada. Como la cancelación es con menos de 24 horas de anticipación, se aplicará el cargo completo.",
    )
    setShowSuccessModal(true)
  }

  const handleProfileUpdate = () => {
    const updatedUser = {
      ...currentUser,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone,
    }
    updateUser(updatedUser)

    // Close the modal
    setShowProfileModal(false)

    // Show success message
    setSuccessMessage("Perfil actualizado correctamente")
    setShowSuccessModal(true)
  }

  const today = new Date().toISOString().split("T")[0]
  const upcomingBookings = bookings.filter(
    (booking) =>
      (booking.date > today || (booking.date === today && booking.time > new Date().toTimeString().slice(0, 5))) &&
      booking.status !== "cancelado",
  )
  const pastBookings = bookings.filter(
    (booking) =>
      booking.date < today ||
      (booking.date === today && booking.time < new Date().toTimeString().slice(0, 5)) ||
      booking.status === "cancelado",
  )

  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmado")

  return (
    <div className="client-dashboard">
      <div className="client-sidebar">
        <div className="client-sidebar-header">
          <h2>Mi Panel</h2>
          <div className="client-user-info">
            <div className="client-user-details">
              <p className="client-user-name">
                {currentUser?.name} {currentUser?.lastname}
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
            {activeTab === "history" && "Mi Historial"}
            {activeTab === "profile" && "Mi Perfil"}
          </h1>
          <div className="client-header-actions">
            <div className="client-notification-container" ref={notificationsRef}>
              <button
                className="client-action-btn"
                title="Notificaciones"
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setNotificationsRead(true)
                }}
              >
                <span className="client-action-icon">🔔</span>
                {confirmedBookings.length > 0 && !notificationsRead && (
                  <span className="client-notification-badge">{confirmedBookings.length}</span>
                )}
              </button>
              {showNotifications && (
                <div className="client-notifications-dropdown">
                  <div className="client-notifications-header">
                    <h3>Notificaciones</h3>
                    <span className="client-notifications-count">{confirmedBookings.length}</span>
                  </div>
                  <div className="client-notifications-content">
                    {confirmedBookings.length > 0 ? (
                      <ul className="client-notifications-list">
                        {confirmedBookings.map((booking) => (
                          <li
                            key={booking.id}
                            className="client-notification-item"
                            onClick={() => {
                              setShowNotifications(false)
                              openDetailsModal(booking)
                            }}
                          >
                            <div className="client-notification-icon">✅</div>
                            <div className="client-notification-details">
                              <div className="client-notification-title">Reserva Confirmada</div>
                              <div className="client-notification-subject">{booking.serviceName}</div>
                              <div className="client-notification-time">
                                {booking.date} a las {booking.time}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="client-notifications-empty">No hay notificaciones nuevas</div>
                    )}
                  </div>
                  <div className="client-notifications-footer">
                    <button
                      className="client-notifications-view-all"
                      onClick={() => {
                        setShowNotifications(false)
                        setActiveTab("bookings")
                      }}
                    >
                      Ver todas mis reservas
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                            {booking.status === "pendiente" && "Pendiente"}
                            {booking.status === "confirmado" && "Confirmada"}
                            {booking.status === "completado" && "Completada"}
                            {booking.status === "cancelado" && "Cancelada"}
                          </span>
                        </div>
                        <div className="client-booking-actions">
                          <button className="client-booking-action-btn view" onClick={() => openDetailsModal(booking)}>
                            Ver Detalles
                          </button>
                          {(booking.status === "pendiente" || booking.status === "confirmado") && (
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
                  <p className="client-no-data">No tenés reservas próximas</p>
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
                            {booking.status === "pendiente" && "Pendiente"}
                            {booking.status === "confirmado" && "Confirmada"}
                            {booking.status === "completado" && "Completada"}
                            {booking.status === "cancelado" && "Cancelada"}
                          </span>
                        </div>
                        <div className="client-booking-actions">
                          <button className="client-booking-action-btn view" onClick={() => openDetailsModal(booking)}>
                            Ver Detalles
                          </button>
                          {booking.status === "completado" && (
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
                  <p className="client-no-data">No tenés reservas pasadas</p>
                )}
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
                            {booking.status === "pendiente" && "Pendiente"}
                            {booking.status === "confirmado" && "Confirmada"}
                            {booking.status === "completado" && "Completada"}
                            {booking.status === "cancelado" && "Cancelada"}
                          </span>
                        </div>
                        <div className="client-booking-actions">
                          <button className="client-booking-action-btn view" onClick={() => openDetailsModal(booking)}>
                            Ver Detalles
                          </button>
                          {booking.status === "completado" && (
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
                  <p className="client-no-data">No tenés reservas pasadas</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="client-profile">
              <div className="client-profile-header">
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
                      <input type="text" value={currentUser?.name} readOnly />
                    </div>
                    <div className="client-form-group">
                      <label>Apellido</label>
                      <input type="text" value={currentUser?.lastname} readOnly />
                    </div>
                    <div className="client-form-group">
                      <label>Email</label>
                      <input type="email" value={currentUser?.email} readOnly />
                    </div>
                    <div className="client-form-group">
                      <label>Teléfono</label>
                      <input type="tel" value={currentUser?.telephone || "+54 9 3624 123456"} readOnly />
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

      {/* Modal para Ver Detalles */}
      {showDetailsModal && selectedBookingDetails && (
        <SimpleModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={`Detalles de Reserva #${selectedBookingDetails.id}`}
        >
          <div className="booking-details">
            <div className="booking-details-section">
              <h3>Información del Servicio</h3>
              <p>
                <strong>Servicio:</strong> {selectedBookingDetails.serviceName}
              </p>
              <p>
                <strong>Profesional:</strong> {selectedBookingDetails.professionalName}
              </p>
              <p>
                <strong>Duración:</strong> {selectedBookingDetails.duration}
              </p>
              <p>
                <strong>Precio:</strong> ${selectedBookingDetails.price?.toLocaleString() || "N/A"}
              </p>
            </div>

            <div className="booking-details-section">
              <h3>Fecha y Hora</h3>
              <p>
                <strong>Fecha:</strong> {selectedBookingDetails.date}
              </p>
              <p>
                <strong>Hora:</strong> {selectedBookingDetails.time}
              </p>
            </div>

            <div className="booking-details-section">
              <h3>Estado de la Reserva</h3>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={`booking-status-text ${selectedBookingDetails.status}`}>
                  {selectedBookingDetails.status === "pending" && "Pendiente"}
                  {selectedBookingDetails.status === "confirmed" && "Confirmada"}
                  {selectedBookingDetails.status === "completed" && "Completada"}
                  {selectedBookingDetails.status === "cancelado" && "Cancelada"}
                </span>
              </p>
              {selectedBookingDetails.paymentStatus && (
                <p>
                  <strong>Estado de Pago:</strong>{" "}
                  <span className={`payment-status-text ${selectedBookingDetails.paymentStatus}`}>
                    {selectedBookingDetails.paymentStatus === "paid" && "Pagado"}
                    {selectedBookingDetails.paymentStatus === "pending" && "Pendiente"}
                    {selectedBookingDetails.paymentStatus === "refunded" && "Reembolsado"}
                  </span>
                </p>
              )}
              {selectedBookingDetails.cancellationReason && (
                <p>
                  <strong>Motivo de Cancelación:</strong> {selectedBookingDetails.cancellationReason}
                </p>
              )}
            </div>
          </div>
        </SimpleModal>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <SimpleModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          title="Editar Perfil"
          onConfirm={handleProfileUpdate}
          confirmText="Guardar Cambios"
          cancelText="Cancelar"
        >
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
            />
          </div>
        </SimpleModal>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <SimpleModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Operación Exitosa">
          <div className="success-modal-content">
            <div className="success-icon">✓</div>
            <p className="success-message">{successMessage}</p>
          </div>
        </SimpleModal>
      )}
    </div>
  )
}

export default ClientDashboard
