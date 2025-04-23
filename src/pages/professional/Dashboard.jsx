"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "../../styles/professional.css"
import SimpleModal from "../../components/SimpleModal"
import ScheduleSelector from "../../components/ScheduleSelector"
import { getProfBookings, cancelBooking, confirmBooking } from '../../services/bookingService';
import { updateUser, setSchedule, getClients } from '../../services/userService';
import { getProfessionalServices } from "../../services/serviceService"
import ClientHistoryModal from "../../components/ClientHistoryModal"
import UserDetailsModal from "../../components/UserDetailsModal"

const ProfessionalDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isProfessional } = useAuth()
  const [activeTab, setActiveTab] = useState("schedule")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [showAppointmentDetailsModal, setShowAppointmentDetailsModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null);
  const [itemToOperate, setItem] = useState(null)
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showConfirmDatesModal, setShowConfirmDatesModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showClientProfileModal, setShowClientProfileModal] = useState(false);
  const [showClientHistoryModal, setShowClientHistoryModal] = useState(false);
  const notificationsRef = useRef(null)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [pendingAction, setPendingAction] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [setSuccessAction] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    email: "",
    telephone: "",
    certification: "",
    bio: "",
    specialties: [""],
  })

  useEffect(() => {
    if (!isProfessional) {
      navigate("/login")
    }
  }, [isProfessional, navigate])

  useEffect(() => {
    if (currentUser) {      
      getUserBookings();
      getMyClients(); 
      fetchServices();     
    } 

    setProfileData({
      name: currentUser.name || "",
      lastname: currentUser.lastname || "",
      email: currentUser.email || "",
      telephone: currentUser.telephone || "",
      certification: currentUser.certification || "",
      bio: currentUser.bio || "",
      specialties: currentUser.specialties || [""],
    })
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

  const getUserBookings = async () =>{
    const authToken = localStorage.getItem('authToken');
    const userBookings =  await getProfBookings(authToken, currentUser.id);
    setBookings(userBookings.length > 0 ? userBookings : [])
  }

  const fetchServices = async () => {
    const authToken = localStorage.getItem('authToken');
    const services = await getProfessionalServices(authToken);
    setServices(services.length > 0 ? services : []);
  };

  const professionalBookings = bookings.filter((booking) => booking.professionalId === currentUser?.id)
  const todayDate = new Date().toISOString().split("T")[0]
  const todayAppointments = professionalBookings
    .filter((booking) => booking.date === todayDate && booking.status !== "cancelado")
    .sort((a, b) => a.time.localeCompare(b.time))
  const upcomingAppointments = professionalBookings
    .filter((booking) => booking.date > todayDate && booking.status !== "cancelado")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)

  const pendingBookings = professionalBookings.filter((booking) => booking.status === "pendiente")

    // TODO: cuando clickeas se quedan en la pantalla de localhost:5173/login pero en blanco, cuando refrescas si carga bien
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

  const confirmConfirm = (id) => {
    setItem(id)
    setShowConfirmModal(true)
  }

  const confirmCancel = (id) => {
    setItem(id)
    setShowCancelModal(true)
  }

  const handleCancelBooking = async () => {
    try {      
      const token = localStorage.getItem('authToken');   
      await cancelBooking(token, itemToOperate);
      setShowCancelModal(false)
      setSuccessMessage("Reserva cancelada correctamente");
      setShowSuccessModal(true);
      getUserBookings()

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cancelar el turno.";
      setErrorMessage(errorMessage);
    } finally {
      setShowCancelModal(false)
    }
  }

  const handleConfirmBooking = async () => {
    try {      
      const token = localStorage.getItem('authToken');   
      await confirmBooking(token, itemToOperate);
      setShowConfirmModal(false)
      setSuccessMessage("Reserva confirmada correctamente");
      setShowSuccessModal(true);
      getUserBookings()

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al confirmar el turno.";
      setErrorMessage(errorMessage);
    } finally {
      setShowConfirmModal(false)
    }
  }

  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAppointmentDetailsModal(true)
  }

  const handleViewServiceDetails = (service) => {
    setSelectedService(service)
    setShowServiceDetailsModal(true)
  }

  const getMyClients = async () =>{
    const authToken = localStorage.getItem('authToken');
    const clients =  await getClients(authToken);
    setClients(clients.length > 0 ? clients : [])
  }

  const filteredClients = clients.filter(
    (client) =>
      searchTerm === "" ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewProfileDetails = (client) => {
    setSelectedClient(client);
    setShowClientProfileModal(true);
  };

  const handleViewHistoryDetails = (client) => {
    setSelectedClient(client);
    setShowClientHistoryModal(true);
  };

  const handleProfileUpdate = async () => {
    try {
      const updatedUser = {
        ...currentUser,
        name: profileData.name,
        lastname: profileData.lastname,
        telephone: profileData.telephone,
        certification: profileData.certification,
        bio: profileData.bio
      };
 
      const token = localStorage.getItem("authToken");
      await updateUser(token, updatedUser);

      setSuccessMessage("Perfil actualizado correctamente")
      setSuccessAction("profile-update")
      setShowSuccessModal(true)

    } catch (error) {
      const message = error.response?.data?.message || "Error al actualizar el usuario.";
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setShowProfileModal(false)
    }
  }

  const handleScheduleSubmit = async (scheduleData) => {
    try {    
      const token = localStorage.getItem('authToken');   

      const formattedSchedule = {
        schedule: Object.fromEntries(
          Object.entries(scheduleData.schedule).map(([day, hours]) => [day.toLowerCase(), hours])
        )
      };

      await setSchedule(token, currentUser.id, formattedSchedule );
      setSuccessMessage("Horarios guardados correctamente");
      setShowSuccessModal(true);
    } catch (err) {    
      const errorMessage = err.response?.data?.message || "Error al guardar los horarios.";
      setErrorMessage(errorMessage);
    } finally {
      setShowConfirmDatesModal(false)
    }
  }

  return (
    <div className="professional-dashboard">
      <div className="professional-sidebar">
        <div className="professional-sidebar-header">
          <h2>Panel Profesional</h2>
          <div className="professional-user-info">
            <div className="professional-user-details">
              <p className="professional-user-name">
                {currentUser?.name} {currentUser?.lastname}
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

          <button
            className={`professional-nav-item ${activeTab === "setSchedule" ? "active" : ""}`}
            onClick={() => setActiveTab("setSchedule")}
          >
            <span className="professional-nav-icon">🕒</span>
            <span>Disponibilidad Horaria</span>
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
            {activeTab === "setSchedule" && "Disponibilidad Horaria"}
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
                            <p className="professional-appointment-client">Cliente: {appointment.clientName}</p>
                            <p className="professional-appointment-duration">Duración: {appointment.duration} minutos</p>
                          </div>
                          <div className="professional-appointment-status">
                            <span className={`appointment-status ${appointment.status}`}>
                              {appointment.status === "pendiente" && "Pendiente"}
                              {appointment.status === "confirmado" && "Confirmada"}
                              {appointment.status === "completado" && "Completada"}
                            </span>
                          </div>
                          <div className="professional-appointment-actions">
                            <button
                              className="professional-appointment-action-btn"
                              onClick={() => handleViewAppointmentDetails(appointment)}
                            >
                              Ver
                            </button>
                            {appointment.status === "confirmado" && (
                              <button
                                className="professional-appointment-action-btn complete"
                                onClick={() => handleAppointmentStatusChange(appointment.id, "completado")}
                              >
                                Completar
                              </button>
                            )}
                            {appointment.status === "pendiente" && (
                              <button
                                className="professional-appointment-action-btn complete"
                                onClick={() => handleAppointmentStatusChange(appointment.id, "confirmado")}
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
                            <p className="professional-appointment-client">Cliente: {appointment.clientName}</p>
                            <p className="professional-appointment-duration">Duración: {appointment.duration} minutos</p>
                          </div>
                          <div className="professional-appointment-status">
                            <span className={`appointment-status ${appointment.status}`}>
                              {appointment.status === "pendiente" && "Pendiente"}
                              {appointment.status === "confirmado" && "Confirmada"}
                            </span>
                          </div>
                          <div className="professional-appointment-actions">
                            <button
                              className="professional-appointment-action-btn"
                              onClick={() => handleViewAppointmentDetails(appointment)}
                            >
                              Ver
                            </button>
                            {appointment.status === "pendiente" && (
                              <button
                                className="professional-appointment-action-btn complete"
                                onClick={() => confirmConfirm(appointment.id)}
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
                          <td>{booking.clientName}</td>
                          <td>
                            <span className={`appointment-status ${booking.status}`}>
                              {booking.status === "pendiente" && "Pendiente"}
                              {booking.status === "confirmado" && "Confirmada"}
                              {booking.status === "completado" && "Completada"}
                              {booking.status === "cancelado" && "Cancelada"}
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
                              {booking.status !== "cancelado" && booking.status !== "completado" && (
                                <button
                                  className="admin-table-action-btn confirm"
                                  title="Confirmar reserva"
                                  onClick={() => confirmConfirm(booking.id)}
                                  disabled={booking.status === "confirmado"}
                                  style={booking.status === "confirmado" ? { opacity: 0.3 } : {}}
                                >
                                  ✅ 
                                </button>
                              )}
                              {booking.status !== "cancelado" && booking.status !== "completado" && (
                                <button
                                  className="professional-table-action-btn delete"
                                  title="Cancelar cita"
                                  onClick={() => confirmCancel(booking.id)}
                                  disabled={booking.status === "cancelado"}
                                  style={booking.status === "cancelado" ? { opacity: 0.3 } : {}}
                                >
                                  ❌
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
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Servicio</th>
                      <th>Última Visita</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td>{client.lastname + ", " + client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.telephone}</td>
                        <td>{client.lastService || "—"}</td>
                        <td>{client.lastVisit || "—"}</td>
                        <td>
                          <div className="professional-table-actions">
                            <button
                              className="professional-table-action-btn view"
                              title="Ver perfil"
                              onClick={() => handleViewProfileDetails(client)}
                            >
                              👁️
                            </button>
                            <button
                              className="professional-table-action-btn history"
                              title="Ver historial"
                              onClick={() => handleViewHistoryDetails(client)}
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
                    <p className="professional-service-duration">Duración: {service.duration} minutos</p>
                    <p className="professional-service-price">Precio: ${typeof service.price === "number" ? service.price.toLocaleString() : "N/A"}</p>
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
                    {currentUser?.name} {currentUser?.lastname}
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
                      <input type="text" value={currentUser?.name} readOnly />
                    </div>
                    <div className="professional-form-group">
                      <label>Apellido</label>
                      <input type="text" value={currentUser?.lastname} readOnly />
                    </div>
                    <div className="professional-form-group">
                      <label>Email</label>
                      <input type="email" value={currentUser?.email} readOnly />
                    </div>
                    <div className="professional-form-group">
                      <label>Teléfono</label>
                      <input type="tel" value={currentUser?.telephone} readOnly />
                    </div>
                  </div>
                  <h3 className="professional-section-title">Especialidades</h3>
                  <div className="professional-form-group">
                    <label>Certificacion</label>
                    <input type="text" value={currentUser?.certification} readOnly />
                  </div>
                </div>

                <div className="professional-profile-section">
                  <h3 className="professional-section-title">Biografia</h3>
                  <div className="professional-form-group">
                    <div className="professional-specialties-bio">
                      <textarea type="text" value={currentUser?.bio} readOnly />
                    </div>
                    <div className="professional-form-group">
                    <label>Especialidades</label>
                    {currentUser?.specialties &&
                      currentUser.specialties.map((specialty, index) => (
                        <span className="professional-specialty-tag" key={index}>
                          {specialty}
                        </span>
                      ))}
                  </div>
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

          {activeTab === "setSchedule" && (
            <div className="professional-services">
              <h3 className="professional-section-title">Seleccioná tus horarios disponibles</h3>
              <ScheduleSelector
                onSubmit={(data) => {
                  console.log("DATA RECIBIDA EN onSubmit:", data);
                  setShowConfirmDatesModal(true);
                  setPendingAction(() => () => handleScheduleSubmit(data));
              }}/>
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
                <strong>Duración:</strong> {selectedAppointment.duration} minutos
              </p>
              <p>
                <strong>Precio:</strong> ${selectedAppointment.price?.toLocaleString() || "N/A"}
              </p>
            </div>

            <div className="appointment-details-section">
              <h3>Información del Cliente</h3>
              <p>
                <strong>Nombre:</strong> {selectedAppointment.clientName}
              </p>
              <p>
                <strong>Email:</strong> {selectedAppointment.clientEmail}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedAppointment.clientTelephone}
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
                  {selectedAppointment.status === "pendiente" && "Pendiente"}
                  {selectedAppointment.status === "confirmado" && "Confirmada"}
                  {selectedAppointment.status === "completado" && "Completada"}
                  {selectedAppointment.status === "cancelado" && "Cancelada"}
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

            {selectedAppointment.status === "pendiente" && (
              <div className="appointment-details-actions">
                <button
                  className="professional-appointment-action-btn complete"
                  onClick={() => {
                    handleConfirmBooking(selectedAppointment.id)
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

      {/* Modal de manejo de turnos */}
      {showCancelModal && (
        <SimpleModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancelar Reserva"
          onConfirm={handleCancelBooking}
          confirmText="Cancelar"
        >
          <p>¿Estás seguro de que deseás cancelar esta reserva?</p>
        </SimpleModal>
      )}

      {showConfirmModal && (
        <SimpleModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Confirmar Reserva"
          onConfirm={handleConfirmBooking}
          confirmText="Confirmar"
        >
          <p>¿Estás seguro de que deseás confirmar esta reserva?</p>
        </SimpleModal>
      )}

      {showConfirmDatesModal && (
        <SimpleModal
          isOpen={showConfirmDatesModal}
          onClose={() => setShowConfirmDatesModal(false)}
          title="Confirmar envío de horarios"
          onConfirm={() => {
            console.log("CONFIRMADO");
            if (pendingAction) pendingAction();
          }}
          confirmText="Confirmar"
        >
          <p>¿Estás seguro de que deseas enviar tu cronograma de horarios de esta semana?</p>
        </SimpleModal>
      )}

      {/* Modal de detalles de clientes */}
      {showClientProfileModal && selectedClient && (
        <UserDetailsModal
          isOpen={showClientProfileModal}
          onClose={() => {
            setShowClientProfileModal(false);
            setSelectedClient(null);
          }}
          user={selectedClient}
        />
      )}

      {showClientHistoryModal && selectedClient && (
        <ClientHistoryModal
          isOpen={showClientHistoryModal}
          onClose={() => {
            setShowClientHistoryModal(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
        />
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
                <strong>Duración:</strong> {selectedService.duration} minutos
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
                    <li key={index}> 💎 {benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedService.includes && selectedService.includes.length > 0 && (
              <div className="service-details-section">
                <h4>Incluye</h4>
                <ul>
                  {selectedService.includes.map((item, index) => (
                    <li key={index}> 🔹 {item}</li>
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
                value={ProfileData.name}
                onChange={(e) => setProfileData({ ...ProfileData, name: e.target.value })}
                required
              />
            </div>
            <div className="professional-form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={ProfileData.lastname}
                onChange={(e) => setProfileData({ ...ProfileData, lastname: e.target.value })}
                required
              />
            </div>
            <div className="professional-form-group">
              <label>Email</label>
              <input
                type="email"
                value={ProfileData.email}
                onChange={(e) => setProfileData({ ...ProfileData, email: e.target.value })}
                required
              />
            </div>
            <div className="professional-form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={ProfileData.telephone}
                onChange={(e) => setProfileData({ ...ProfileData, telephone: e.target.value })}
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

      {showErrorModal && (
        <SimpleModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} title="Error">
          <div className="error-modal-content">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{errorMessage}</p>
          </div>
        </SimpleModal>
      )}
    </div>
  )
}

export default ProfessionalDashboard
