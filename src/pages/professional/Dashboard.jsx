"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockBookings } from "../../data/mockBookings"
import "../../styles/professional.css"
import SimpleModal from "../../components/SimpleModal"

const ProfessionalDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isProfessional } = useAuth()
  const [activeTab, setActiveTab] = useState("schedule")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [bookings, setBookings] = useState(mockBookings)
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const notificationsRef = useRef(null)
  const [notificationsRead, setNotificationsRead] = useState(false)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [setSuccessAction] = useState("")

  const clients = [
    { id: "3", name: "Regular User", email: "user@example.com", phone: "+54 9 3624 123456", lastVisit: "2025-04-25" },
    { id: "4", name: "Client Two", email: "client2@example.com", phone: "+54 9 3624 789012", lastVisit: "2025-05-10" },
    {
      id: "5",
      name: "Client Three",
      email: "client3@example.com",
      phone: "+54 9 3624 345678",
      lastVisit: "2025-05-05",
    },
  ]

  const services = [
    {
      id: "1",
      name: "Masaje Anti-stress",
      category: "Corporales",
      duration: "60 minutos",
      price: 5500,
      description:
        "Un masaje relajante diseñado para aliviar la tensión y el estrés acumulado. Utiliza técnicas suaves y aceites esenciales para promover la relajación profunda.",
      benefits: ["Reduce el estrés y la ansiedad", "Mejora la calidad del sueño", "Alivia dolores musculares leves"],
    },
    {
      id: "2",
      name: "Masaje Descontracturante",
      category: "Corporales",
      duration: "50 minutos",
      price: 6000,
      description:
        "Masaje terapéutico enfocado en liberar contracturas y nudos musculares. Utiliza técnicas de presión profunda para aliviar la tensión muscular crónica.",
      benefits: ["Alivia contracturas musculares", "Mejora la movilidad", "Reduce el dolor crónico"],
    },
    {
      id: "3",
      name: "VelaSlim",
      category: "Corporales",
      duration: "45 minutos",
      price: 8500,
      description:
        "Tratamiento corporal que combina radiofrecuencia, luz infrarroja y masaje de vacío para reducir la apariencia de celulitis y mejorar el contorno corporal.",
      benefits: [
        "Reduce la apariencia de celulitis",
        "Mejora la firmeza de la piel",
        "Ayuda a moldear el contorno corporal",
      ],
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  })

  useEffect(() => {
    if (!isProfessional) {
      navigate("/login")
    }
  }, [isProfessional, navigate])

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

  const professionalBookings = bookings.filter((booking) => booking.professionalId === currentUser?.id)
  const todayDate = new Date().toISOString().split("T")[0]
  const todayAppointments = professionalBookings
    .filter((booking) => booking.date === todayDate && booking.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time))
  const upcomingAppointments = professionalBookings
    .filter((booking) => booking.date > todayDate && booking.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)

  // Get pending bookings for notifications
  const pendingBookings = professionalBookings.filter((booking) => booking.status === "pending")

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handlePreviousDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() - 1)
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const handleNextDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + 1)
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const handleAppointmentStatusChange = (appointmentId, newStatus) => {
    setBookings(bookings.map((booking) => (booking.id === appointmentId ? { ...booking, status: newStatus } : booking)))
  }

  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentDetailsModal(true)
  }

  const handleViewServiceDetails = (service) => {
    setSelectedService(service)
    setShowServiceDetailsModal(true)
  }

  const handleProfileUpdate = () => {
    setShowProfileModal(false)
    setSuccessMessage("Perfil actualizado correctamente")
    setSuccessAction("profile-update")
    setShowSuccessModal(true)
  }

  const filteredClients = clients.filter(
    (client) =>
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="professional-dashboard">
      <div className="professional-sidebar">
        <div className="professional-sidebar-header">
          <h2>Panel Profesional</h2>
          <div className="professional-user-info">
            <div className="professional-user-details">
              <p className="professional-user-name">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="professional-user-role">Profesional</p>
            </div>
          </div>
        </div>

        <nav className="professional-nav">
          <button
            className={`professional-nav-item ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <span className="professional-nav-icon">📅</span>
            <span>Mi Horario</span>
          </button>

          <button
            className={`professional-nav-item ${activeTab === "agenda" ? "active" : ""}`}
            onClick={() => setActiveTab("agenda")}
          >
            <span className="professional-nav-icon">📋</span>
            <span>Mi Agenda</span>
          </button>

          <button
            className={`professional-nav-item ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => setActiveTab("clients")}
          >
            <span className="professional-nav-icon">👥</span>
            <span>Mis Clientes</span>
          </button>

          <button
            className={`professional-nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <span className="professional-nav-icon">💆</span>
            <span>Mis Servicios</span>
          </button>

          <button
            className={`professional-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="professional-nav-icon">👤</span>
            <span>Mi Perfil</span>
          </button>
        </nav>

        <div className="professional-sidebar-footer">
          <button className="professional-logout-btn" onClick={handleLogout}>
            <span className="professional-nav-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="professional-content">
        <div className="professional-header">
          <h1 className="professional-title">
            {activeTab === "schedule" && "Mi Horario"}
            {activeTab === "agenda" && "Mi Agenda"}
            {activeTab === "clients" && "Mis Clientes"}
            {activeTab === "services" && "Mis Servicios"}
            {activeTab === "profile" && "Mi Perfil"}
          </h1>
          <div className="professional-header-actions">
            <div className="professional-notification-container" ref={notificationsRef}>
              <button
                className="professional-action-btn"
                title="Notificaciones"
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setNotificationsRead(true)
                }}
              >
                <span className="professional-action-icon">🔔</span>
                {pendingBookings.length > 0 && !notificationsRead && (
                  <span className="professional-notification-badge">{pendingBookings.length}</span>
                )}
              </button>
              {showNotifications && (
                <div className="professional-notifications-dropdown">
                  <div className="professional-notifications-header">
                    <h3>Notificaciones</h3>
                    <span className="professional-notifications-count">{pendingBookings.length}</span>
                  </div>
                  <div className="professional-notifications-content">
                    {pendingBookings.length > 0 ? (
                      <ul className="professional-notifications-list">
                        {pendingBookings.map((booking) => (
                          <li
                            key={booking.id}
                            className="professional-notification-item"
                            onClick={() => {
                              setShowNotifications(false)
                              handleViewAppointmentDetails(booking)
                            }}
                          >
                            <div className="professional-notification-icon">🕒</div>
                            <div className="professional-notification-details">
                              <div className="professional-notification-title">Nueva Reserva</div>
                              <div className="professional-notification-subject">{booking.serviceName}</div>
                              <div className="professional-notification-time">
                                {booking.date} a las {booking.time}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="professional-notifications-empty">No hay notificaciones nuevas</div>
                    )}
                  </div>
                  <div className="professional-notifications-footer">
                    <button
                      className="professional-notifications-view-all"
                      onClick={() => {
                        setShowNotifications(false)
                        setActiveTab("agenda")
                      }}
                    >
                      Ver mi agenda
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="professional-action-btn" title="Configuración" onClick={() => setShowProfileModal(true)}>
              <span className="professional-action-icon">⚙️</span>
            </button>
          </div>
        </div>

        <div className="professional-main">
          {activeTab === "schedule" && (
            <div className="professional-schedule">
              <div className="professional-schedule-header">
                <div className="professional-date-selector">
                  <button className="professional-date-nav-btn" onClick={handlePreviousDay}>
                    ◀
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="professional-date-input"
                  />
                  <button className="professional-date-nav-btn" onClick={handleNextDay}>
                    ▶
                  </button>
                </div>
              </div>

              <div className="professional-appointments">
                <div className="professional-today-appointments">
                  <h3 className="professional-section-title">Citas de Hoy</h3>
                  {todayAppointments.length > 0 ? (
                    <div className="professional-appointments-list">
                      {todayAppointments.map((appointment) => (
                        <div className="professional-appointment-card" key={appointment.id}>
                          <div className="professional-appointment-time">{appointment.time}</div>
                          <div className="professional-appointment-details">
                            <h4 className="professional-appointment-service">{appointment.serviceName}</h4>
                            <p className="professional-appointment-client">Cliente #{appointment.userId}</p>
                            <p className="professional-appointment-duration">{appointment.duration}</p>
                          </div>
                          <div className="professional-appointment-status">
                            <span className={`appointment-status ${appointment.status}`}>
                              {appointment.status === "pending" && "Pendiente"}
                              {appointment.status === "confirmed" && "Confirmada"}
                              {appointment.status === "completed" && "Completada"}
                            </span>
                          </div>
                          <div className="professional-appointment-actions">
                            <button
                              className="professional-appointment-action-btn"
                              onClick={() => handleViewAppointmentDetails(appointment)}
                            >
                              Ver
                            </button>
                            {appointment.status === "confirmed" && (
                              <button
                                className="professional-appointment-action-btn complete"
                                onClick={() => handleAppointmentStatusChange(appointment.id, "completed")}
                              >
                                Completar
                              </button>
                            )}
                            {appointment.status === "pending" && (
                              <button
                                className="professional-appointment-action-btn complete"
                                onClick={() => handleAppointmentStatusChange(appointment.id, "confirmed")}
                              >
                                Confirmar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="professional-no-data">No hay citas programadas para hoy</p>
                  )}
                </div>

                <div className="professional-upcoming-appointments">
                  <h3 className="professional-section-title">Próximas Citas</h3>
                  {upcomingAppointments.length > 0 ? (
                    <div className="professional-appointments-list">
                      {upcomingAppointments.map((appointment) => (
                        <div className="professional-appointment-card" key={appointment.id}>
                          <div className="professional-appointment-date">
                            <div className="appointment-date">{appointment.date}</div>
                            <div className="appointment-time">{appointment.time}</div>
                          </div>
                          <div className="professional-appointment-details">
                            <h4 className="professional-appointment-service">{appointment.serviceName}</h4>
                            <p className="professional-appointment-client">Cliente #{appointment.userId}</p>
                            <p className="professional-appointment-duration">{appointment.duration}</p>
                          </div>
                          <div className="professional-appointment-status">
                            <span className={`appointment-status ${appointment.status}`}>
                              {appointment.status === "pending" && "Pendiente"}
                              {appointment.status === "confirmed" && "Confirmada"}
                            </span>
                          </div>
                          <div className="professional-appointment-actions">
                            <button
                              className="professional-appointment-action-btn"
                              onClick={() => handleViewAppointmentDetails(appointment)}
                            >
                              Ver
                            </button>
                            {appointment.status === "pending" && (
                              <button
                                className="professional-appointment-action-btn complete"
                                onClick={() => handleAppointmentStatusChange(appointment.id, "confirmed")}
                              >
                                Confirmar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="professional-no-data">No hay próximas citas programadas</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "agenda" && (
            <div className="professional-agenda">
              <div className="professional-section-actions">
                <div className="professional-search">
                  <input
                    type="text"
                    placeholder="Buscar citas..."
                    className="professional-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="professional-search-btn">🔍</button>
                </div>
              </div>

              <div className="professional-table-container">
                <table className="professional-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Servicio</th>
                      <th>Cliente</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professionalBookings
                      .filter(
                        (booking) =>
                          searchTerm === "" ||
                          booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.date.includes(searchTerm),
                      )
                      .sort((a, b) => {
                        // Ordenar por fecha y hora
                        const dateA = new Date(`${a.date}T${a.time}`)
                        const dateB = new Date(`${b.date}T${b.time}`)
                        return dateA - dateB
                      })
                      .map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.date}</td>
                          <td>{booking.time}</td>
                          <td>{booking.serviceName}</td>
                          <td>Cliente #{booking.userId}</td>
                          <td>
                            <span className={`appointment-status ${booking.status}`}>
                              {booking.status === "pending" && "Pendiente"}
                              {booking.status === "confirmed" && "Confirmada"}
                              {booking.status === "completed" && "Completada"}
                              {booking.status === "cancelled" && "Cancelada"}
                            </span>
                          </td>
                          <td>
                            <div className="professional-table-actions">
                              <button
                                className="professional-table-action-btn view"
                                title="Ver detalles"
                                onClick={() => handleViewAppointmentDetails(booking)}
                              >
                                👁️
                              </button>
                              {booking.status !== "cancelled" && booking.status !== "completed" && (
                                <button
                                  className="professional-table-action-btn delete"
                                  title="Cancelar cita"
                                  onClick={() => {
                                    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
                                      handleAppointmentStatusChange(booking.id, "cancelled")

                                      // Mostrar modal de éxito
                                      setSuccessMessage("Cita cancelada correctamente")
                                      setSuccessAction("cancel-appointment")
                                      setShowSuccessModal(true)
                                    }
                                  }}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="professional-clients">
              <div className="professional-section-actions">
                <div className="professional-search">
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    className="professional-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="professional-search-btn">🔍</button>
                </div>
              </div>

              <div className="professional-table-container">
                <table className="professional-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Última Visita</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td>#{client.id}</td>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td>{client.lastVisit}</td>
                        <td>
                          <div className="professional-table-actions">
                            <button
                              className="professional-table-action-btn view"
                              title="Ver perfil"
                              onClick={() => alert(`Ver perfil de ${client.name}`)}
                            >
                              👁️
                            </button>
                            <button
                              className="professional-table-action-btn history"
                              title="Ver historial"
                              onClick={() => alert(`Ver historial de ${client.name}`)}
                            >
                              📋
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="professional-services">
              <h3 className="professional-section-title">Mis Servicios Asignados</h3>
              <div className="professional-services-grid">
                {services.map((service) => (
                  <div className="professional-service-card" key={service.id}>
                    <h4 className="professional-service-title">{service.name}</h4>
                    <p className="professional-service-category">Categoría: {service.category}</p>
                    <p className="professional-service-duration">Duración: {service.duration}</p>
                    <p className="professional-service-price">Precio: ${service.price.toLocaleString()}</p>
                    <button
                      className="professional-service-btn view-details-btn"
                      onClick={() => handleViewServiceDetails(service)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="professional-profile">
              <div className="professional-profile-header">
                <div className="professional-profile-info">
                  <h2 className="professional-profile-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                  <p className="professional-profile-role">Profesional</p>
                  <p className="professional-profile-email">{currentUser?.email}</p>
                </div>
                <button className="professional-edit-profile-btn" onClick={() => setShowProfileModal(true)}>
                  Editar Perfil
                </button>
              </div>

              <div className="professional-profile-sections">
                <div className="professional-profile-section">
                  <h3 className="professional-section-title">Información Personal</h3>
                  <div className="professional-profile-form">
                    <div className="professional-form-group">
                      <label>Nombre</label>
                      <input type="text" value={currentUser?.firstName} readOnly />
                    </div>
                    <div className="professional-form-group">
                      <label>Apellido</label>
                      <input type="text" value={currentUser?.lastName} readOnly />
                    </div>
                    <div className="professional-form-group">
                      <label>Email</label>
                      <input type="email" value={currentUser?.email} readOnly />
                    </div>
                    <div className="professional-form-group">
                      <label>Teléfono</label>
                      <input type="tel" value="+54 9 3624 123456" readOnly />
                    </div>
                  </div>
                </div>

                <div className="professional-profile-section">
                  <h3 className="professional-section-title">Especialidades</h3>
                  <div className="professional-specialties">
                    {currentUser?.specialties &&
                      currentUser.specialties.map((specialty, index) => (
                        <span className="professional-specialty-tag" key={index}>
                          {specialty}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="professional-profile-section">
                  <h3 className="professional-section-title">Horario de Trabajo</h3>
                  <div className="professional-work-hours">
                    <div className="professional-work-day">
                      <span className="day-name">Lunes</span>
                      <span className="day-hours">9:00 - 18:00</span>
                    </div>
                    <div className="professional-work-day">
                      <span className="day-name">Martes</span>
                      <span className="day-hours">9:00 - 18:00</span>
                    </div>
                    <div className="professional-work-day">
                      <span className="day-name">Miércoles</span>
                      <span className="day-hours">9:00 - 18:00</span>
                    </div>
                    <div className="professional-work-day">
                      <span className="day-name">Jueves</span>
                      <span className="day-hours">9:00 - 18:00</span>
                    </div>
                    <div className="professional-work-day">
                      <span className="day-name">Viernes</span>
                      <span className="day-hours">9:00 - 18:00</span>
                    </div>
                    <div className="professional-work-day">
                      <span className="day-name">Sábado</span>
                      <span className="day-hours">10:00 - 14:00</span>
                    </div>
                    <div className="professional-work-day">
                      <span className="day-name">Domingo</span>
                      <span className="day-hours">Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles de cita */}
      {showAppointmentDetailsModal && selectedAppointment && (
        <SimpleModal
          isOpen={showAppointmentDetailsModal}
          onClose={() => setShowAppointmentDetailsModal(false)}
          title="Detalles de la Cita"
        >
          <div className="appointment-details">
            <div className="appointment-details-section">
              <h3>Información del Servicio</h3>
              <p>
                <strong>Servicio:</strong> {selectedAppointment.serviceName}
              </p>
              <p>
                <strong>Duración:</strong> {selectedAppointment.duration}
              </p>
              <p>
                <strong>Precio:</strong> ${selectedAppointment.price?.toLocaleString() || "N/A"}
              </p>
            </div>

            <div className="appointment-details-section">
              <h3>Información del Cliente</h3>
              <p>
                <strong>Cliente ID:</strong> #{selectedAppointment.userId}
              </p>
              <p>
                <strong>Nombre:</strong> {clients.find((c) => c.id === selectedAppointment.userId)?.name || "Cliente"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {clients.find((c) => c.id === selectedAppointment.userId)?.email || "No disponible"}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {clients.find((c) => c.id === selectedAppointment.userId)?.phone || "No disponible"}
              </p>
            </div>

            <div className="appointment-details-section">
              <h3>Fecha y Hora</h3>
              <p>
                <strong>Fecha:</strong> {selectedAppointment.date}
              </p>
              <p>
                <strong>Hora:</strong> {selectedAppointment.time}
              </p>
            </div>

            <div className="appointment-details-section">
              <h3>Estado de la Cita</h3>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={`appointment-status-text ${selectedAppointment.status}`}>
                  {selectedAppointment.status === "pending" && "Pendiente"}
                  {selectedAppointment.status === "confirmed" && "Confirmada"}
                  {selectedAppointment.status === "completed" && "Completada"}
                  {selectedAppointment.status === "cancelled" && "Cancelada"}
                </span>
              </p>
              {selectedAppointment.paymentStatus && (
                <p>
                  <strong>Estado de Pago:</strong>{" "}
                  <span className={`payment-status-text ${selectedAppointment.paymentStatus}`}>
                    {selectedAppointment.paymentStatus === "paid" && "Pagado"}
                    {selectedAppointment.paymentStatus === "pending" && "Pendiente"}
                    {selectedAppointment.paymentStatus === "refunded" && "Reembolsado"}
                  </span>
                </p>
              )}
            </div>

            {selectedAppointment.status === "pending" && (
              <div className="appointment-details-actions">
                <button
                  className="professional-appointment-action-btn complete"
                  onClick={() => {
                    handleAppointmentStatusChange(selectedAppointment.id, "confirmed")
                    setShowAppointmentDetailsModal(false)

                    // Mostrar modal de éxito
                    setSuccessMessage("Cita confirmada correctamente")
                    setSuccessAction("confirm-appointment")
                    setShowSuccessModal(true)
                  }}
                >
                  Confirmar Cita
                </button>
              </div>
            )}
          </div>
        </SimpleModal>
      )}

      {/* Modal de detalles de servicio */}
      {showServiceDetailsModal && selectedService && (
        <SimpleModal
          isOpen={showServiceDetailsModal}
          onClose={() => setShowServiceDetailsModal(false)}
          title="Detalles del Servicio"
        >
          <div className="service-details">
            <h3>{selectedService.name}</h3>

            <div className="service-details-section">
              <p>
                <strong>Categoría:</strong> {selectedService.category}
              </p>
              <p>
                <strong>Duración:</strong> {selectedService.duration}
              </p>
              <p>
                <strong>Precio:</strong> ${selectedService.price.toLocaleString()}
              </p>
            </div>

            <div className="service-details-section">
              <h4>Descripción</h4>
              <p>{selectedService.description}</p>
            </div>

            {selectedService.benefits && selectedService.benefits.length > 0 && (
              <div className="service-details-section">
                <h4>Beneficios</h4>
                <ul>
                  {selectedService.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SimpleModal>
      )}

      {/* Modal de edición de perfil */}
      {showProfileModal && (
        <SimpleModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          title="Editar Perfil Profesional"
          onConfirm={handleProfileUpdate}
          confirmText="Guardar Cambios"
          cancelText="Cancelar"
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="professional-form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                required
              />
            </div>
            <div className="professional-form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                required
              />
            </div>
            <div className="professional-form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
              />
            </div>
            <div className="professional-form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>
          </form>
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

export default ProfessionalDashboard
