"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockBookings, mockTimeSlots } from "../../data/mockBookings"
import "../../styles/professional.css"

const ProfessionalDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isProfessional } = useAuth()
  const [activeTab, setActiveTab] = useState("schedule")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [bookings, setBookings] = useState(mockBookings)
  const [timeSlots, setTimeSlots] = useState(mockTimeSlots)
  const [blockedSlots, setBlockedSlots] = useState([])
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedTimeToBlock, setSelectedTimeToBlock] = useState(null)
  const [blockReason, setBlockReason] = useState("")
  // Using a regular constant instead of state since we're not updating it
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
  const [searchTerm, setSearchTerm] = useState("")

  // Redirect if not professional
  useEffect(() => {
    if (!isProfessional) {
      navigate("/login")
    }
  }, [isProfessional, navigate])

  // Filter bookings for the current professional
  const professionalBookings = bookings.filter((booking) => booking.professionalId === currentUser?.id)

  // Filter today's appointments
  const todayDate = new Date().toISOString().split("T")[0]
  const todayAppointments = professionalBookings
    .filter((booking) => booking.date === todayDate && booking.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time))

  // Filter upcoming appointments (excluding today)
  const upcomingAppointments = professionalBookings
    .filter((booking) => booking.date > todayDate && booking.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  // Handle previous day
  const handlePreviousDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() - 1)
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  // Handle next day
  const handleNextDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + 1)
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  // Handle block time slot
  const handleBlockTimeSlot = (timeSlot) => {
    setSelectedTimeToBlock(timeSlot)
    setShowBlockModal(true)
  }

  // Confirm block time slot
  const confirmBlockTimeSlot = () => {
    if (selectedTimeToBlock) {
      // Add to blocked slots
      setBlockedSlots([
        ...blockedSlots,
        {
          date: selectedDate,
          time: selectedTimeToBlock.time,
          reason: blockReason,
        },
      ])

      // Update time slots to show as unavailable
      setTimeSlots(
        timeSlots.map((slot) => (slot.time === selectedTimeToBlock.time ? { ...slot, available: false } : slot)),
      )

      setShowBlockModal(false)
      setSelectedTimeToBlock(null)
      setBlockReason("")
    }
  }

  // Handle appointment status change
  const handleAppointmentStatusChange = (appointmentId, newStatus) => {
    setBookings(bookings.map((booking) => (booking.id === appointmentId ? { ...booking, status: newStatus } : booking)))
  }

  // Filter clients based on search term
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
            <div className="professional-avatar">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture || "/placeholder.svg"} alt="Perfil" />
              ) : (
                <>
                  {currentUser?.firstName?.charAt(0)}
                  {currentUser?.lastName?.charAt(0)}
                </>
              )}
            </div>
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
            {activeTab === "schedule" && "Mi Agenda"}
            {activeTab === "clients" && "Mis Clientes"}
            {activeTab === "services" && "Mis Servicios"}
            {activeTab === "profile" && "Mi Perfil"}
          </h1>
          <div className="professional-header-actions">
            <button className="professional-action-btn" title="Notificaciones">
              <span className="professional-action-icon">🔔</span>
            </button>
            <button className="professional-action-btn" title="Configuración">
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
                <button className="professional-add-btn" onClick={() => setShowBlockModal(true)}>
                  + Bloquear Horario
                </button>
              </div>

              <div className="professional-schedule-grid">
                <div className="professional-time-slots">
                  <h3 className="professional-section-title">Horarios del Día</h3>
                  <div className="professional-slots-grid">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`professional-time-slot ${!slot.available ? "booked" : ""}`}
                        onClick={() => slot.available && handleBlockTimeSlot(slot)}
                      >
                        <span className="professional-slot-time">{slot.time}</span>
                        <span className="professional-slot-status">{slot.available ? "Disponible" : "Reservado"}</span>
                      </div>
                    ))}
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
                                onClick={() => alert(`Ver detalles de la cita #${appointment.id}`)}
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
                                onClick={() => alert(`Ver detalles de la cita #${appointment.id}`)}
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
                <div className="professional-service-card">
                  <h4 className="professional-service-title">Masaje Anti-stress</h4>
                  <p className="professional-service-category">Categoría: Corporales</p>
                  <p className="professional-service-duration">Duración: 60 minutos</p>
                  <p className="professional-service-price">Precio: $5,500</p>
                  <button
                    className="professional-service-btn"
                    onClick={() => alert("Ver detalles del servicio Masaje Anti-stress")}
                  >
                    Ver Detalles
                  </button>
                </div>
                <div className="professional-service-card">
                  <h4 className="professional-service-title">Masaje Descontracturante</h4>
                  <p className="professional-service-category">Categoría: Corporales</p>
                  <p className="professional-service-duration">Duración: 50 minutos</p>
                  <p className="professional-service-price">Precio: $6,000</p>
                  <button
                    className="professional-service-btn"
                    onClick={() => alert("Ver detalles del servicio Masaje Descontracturante")}
                  >
                    Ver Detalles
                  </button>
                </div>
                <div className="professional-service-card">
                  <h4 className="professional-service-title">VelaSlim</h4>
                  <p className="professional-service-category">Categoría: Corporales</p>
                  <p className="professional-service-duration">Duración: 45 minutos</p>
                  <p className="professional-service-price">Precio: $8,500</p>
                  <button
                    className="professional-service-btn"
                    onClick={() => alert("Ver detalles del servicio VelaSlim")}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="professional-profile">
              <div className="professional-profile-header">
        <div className="professional-profile-avatar">
          {currentUser?.profilePicture ? (
            <img src={currentUser.profilePicture || "/placeholder.svg"} alt="Perfil" />
          ) : (
            <>
              {currentUser?.firstName?.charAt(0)}
              {currentUser?.lastName?.charAt(0)}
            </>
          )}
        </div>
                <div className="professional-profile-info">
                  <h2 className="professional-profile-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h2>
                  <p className="professional-profile-role">Profesional</p>
                  <p className="professional-profile-email">{currentUser?.email}</p>
                </div>
                <button className="professional-edit-profile-btn" onClick={() => alert("Editar perfil")}>
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

      {/* Block Time Slot Modal */}
      {showBlockModal && (
        <div className="professional-modal-overlay">
          <div className="professional-modal">
            <div className="professional-modal-header">
              <h2>Bloquear Horario</h2>
            </div>
            <div className="professional-modal-content">
              <p>Selecciona el horario que deseas bloquear para el día {selectedDate}:</p>

              {!selectedTimeToBlock && (
                <div className="professional-modal-time-slots">
                  {timeSlots
                    .filter((slot) => slot.available)
                    .map((slot, index) => (
                      <button
                        key={index}
                        className="professional-modal-time-slot"
                        onClick={() => setSelectedTimeToBlock(slot)}
                      >
                        {slot.time}
                      </button>
                    ))}
                </div>
              )}

              {selectedTimeToBlock && (
                <div className="professional-modal-selected-time">
                  <p>
                    Horario seleccionado: <strong>{selectedTimeToBlock.time}</strong>
                  </p>
                  <div className="professional-form-group">
                    <label>Motivo del bloqueo:</label>
                    <input
                      type="text"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Ej: Almuerzo, Reunión, etc."
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="professional-modal-footer">
              <button
                className="professional-modal-btn cancel"
                onClick={() => {
                  setShowBlockModal(false)
                  setSelectedTimeToBlock(null)
                  setBlockReason("")
                }}
              >
                Cancelar
              </button>
              {selectedTimeToBlock && (
                <button className="professional-modal-btn block" onClick={confirmBlockTimeSlot} disabled={!blockReason}>
                  Bloquear Horario
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfessionalDashboard

