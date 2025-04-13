"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockBookings, mockContactMessages } from "../../data/mockBookings"
import { services } from "../../data/mockData"
import "../../styles/admin.css"
import "../../index.css"
import MessageResponseModal from "../../components/MessageResponseModal"
import UserFormModal from "../../components/UserFormModal"
import UserDetailsModal from "../../components/UserDetailsModal"
import ProfileConfigModal from "../../components/ProfileConfigModal"
import NotificationsDropdown from "../../components/NotificationsDropdown"
import SimpleModal from "../../components/SimpleModal"
import ServiceDetailsModal from "../../components/ServiceDetailsModal"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [bookings, setBookings] = useState(mockBookings)
  const [messages, setMessages] = useState(mockContactMessages)
  const [servicesList, setServicesList] = useState(services)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState("")
  const [currentService, setCurrentService] = useState(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [showUserFormModal, setShowUserFormModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [currentUser2, setCurrentUser2] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false)
  const [showServiceEditModal, setShowServiceEditModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  // Add state for pending professionals
  const [pendingProfessionals, setPendingProfessionals] = useState([
    {
      id: "101",
      firstName: "María",
      lastName: "González",
      email: "maria@example.com",
      phone: "+54 9 3624 567890",
      role: "professional",
      status: "pending",
      requestDate: "2025-04-10",
      professionalInfo: {
        specialties: ["Masajes", "Tratamientos Faciales"],
        experience: "5 años",
        certification: "Certificado en Terapias Corporales",
        bio: "Especialista en masajes terapéuticos y tratamientos faciales rejuvenecedores."
      }
    },
    {
      id: "102",
      firstName: "Carlos",
      lastName: "Rodríguez",
      email: "carlos@example.com",
      phone: "+54 9 3624 123789",
      role: "professional",
      status: "pending",
      requestDate: "2025-04-12",
      professionalInfo: {
        specialties: ["Fisioterapia", "Rehabilitación"],
        experience: "8 años",
        certification: "Licenciado en Kinesiología",
        bio: "Especializado en rehabilitación física y tratamientos para deportistas."
      }
    },
    {
      id: "103",
      firstName: "Laura",
      lastName: "Martínez",
      email: "laura@example.com",
      phone: "+54 9 3624 456123",
      role: "professional",
      status: "pending",
      requestDate: "2025-04-15",
      professionalInfo: {
        specialties: ["Estética", "Depilación"],
        experience: "3 años",
        certification: "Técnica en Estética Profesional",
        bio: "Especialista en tratamientos estéticos y cuidado de la piel."
      }
    }
  ])
  
  const [users, setUsers] = useState([
    {
      id: "1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: "admin",
    },
    {
      id: "2",
      firstName: "Professional",
      lastName: "User",
      email: "pro@example.com",
      role: "professional",
      specialties: ["Masajes", "Tratamientos Corporales"],
    },
    {
      id: "3",
      firstName: "Regular",
      lastName: "User",
      email: "user@example.com",
      role: "client",
    },
  ])

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login")
    }
  }, [isAdmin, navigate])

  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const unreadMessages = messages.filter((msg) => msg.status === "unread")
  const bookingStats = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    total: bookings.length,
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)))
  }

  const handleMessageStatusChange = (messageId, newStatus) => {
    setMessages(messages.map((message) => (message.id === messageId ? { ...message, status: newStatus } : message)))
  }

  const confirmDelete = (id, type) => {
    setItemToDelete(id)
    setDeleteType(type)
    setShowDeleteModal(true)
  }

  const handleDelete = () => {
    if (deleteType === "booking") {
      setBookings(bookings.filter((booking) => booking.id !== itemToDelete))
    } else if (deleteType === "service") {
      setServicesList(servicesList.filter((service) => service.id !== itemToDelete))
    } else if (deleteType === "message") {
      setMessages(messages.filter((message) => message.id !== itemToDelete))
    } else if (deleteType === "user") {
      setUsers(users.filter((user) => user.id !== itemToDelete))
    }
    setShowDeleteModal(false)
    
    // Show success message
    setSuccessMessage("Elemento eliminado correctamente");
    setShowSuccessModal(true);
  }

  // Service handlers - now separated for view and edit
  const handleViewServiceDetails = (service) => {
    setCurrentService(service)
    setShowServiceDetailsModal(true)
  }

  const handleServiceEdit = (service) => {
    setCurrentService(service)
    setShowServiceEditModal(true)
  }

  const handleServiceSave = (serviceData) => {
    if (serviceData.id) {
      setServicesList(servicesList.map((service) => (service.id === serviceData.id ? { ...serviceData } : service)))
    } else {
      const newService = {
        ...serviceData,
        id: (Math.max(...servicesList.map((s) => Number.parseInt(s.id))) + 1).toString(),
      }
      setServicesList([...servicesList, newService])
    }
    setShowServiceEditModal(false)
    
    // Show success message
    setSuccessMessage(serviceData.id ? "Servicio actualizado correctamente" : "Servicio creado correctamente");
    setShowSuccessModal(true);
  }

  // Other handlers
  const handleOpenResponseModal = (message) => {
    setCurrentMessage(message)
    setShowResponseModal(true)
  }

  const handleSendResponse = (messageId, responseText) => {
    // In a real app, you would send the response to the backend
    console.log(`Sending response to message ${messageId}: ${responseText}`)

    // Update the message status to "responded"
    handleMessageStatusChange(messageId, "responded")
  }

  const handleAddUser = (userData) => {
    setUsers([...users, userData])
    
    // Show success message
    setSuccessMessage("Usuario agregado correctamente");
    setShowSuccessModal(true);
  }

  const handleViewUserDetails = (user) => {
    setCurrentUser2(user)
    setShowUserDetailsModal(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser2(user)
    setShowUserFormModal(true)
  }

  const handleSaveProfile = (updatedProfile) => {
    console.log("Saving profile:", updatedProfile)
    
    // Show success message
    setSuccessMessage("Perfil actualizado correctamente");
    setShowSuccessModal(true);
  }
  
  // Add functions to handle professional approvals
  const handleApproveRequest = (professionalId) => {
    // Update the professional status
    const professionalToApprove = pendingProfessionals.find(
      (professional) => professional.id === professionalId
    );
    
    if (professionalToApprove) {
      // Add the professional to users list
      const updatedProfessional = { ...professionalToApprove, status: "approved" };
      setUsers([...users, updatedProfessional]);
      
      // Remove from pending list
      setPendingProfessionals(pendingProfessionals.filter(
        (professional) => professional.id !== professionalId
      ));
      
      // Show success message
      setSuccessMessage("Profesional aprobado correctamente");
      setShowSuccessModal(true);
    }
  };

  const handleRejectRequest = (professionalId) => {
    // Remove the professional from pending list
    setPendingProfessionals(pendingProfessionals.filter(
      (professional) => professional.id !== professionalId
    ));
    
    // Show success message
    setSuccessMessage("Solicitud rechazada correctamente");
    setShowSuccessModal(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesDate = dateFilter === "" || booking.date === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch = searchTerm === "" || service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Panel de Administración</h2>
          <div className="admin-user-info">
            <div className="admin-user-details">
              <p className="admin-user-name">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="admin-user-role">Administrador</p>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            data-tab="overview"
          >
            <span className="admin-nav-icon">📊</span>
            <span>Resumen</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
            data-tab="bookings"
          >
            <span className="admin-nav-icon">📅</span>
            <span>Reservas</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
            data-tab="services"
          >
            <span className="admin-nav-icon">💆</span>
            <span>Servicios</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
            data-tab="users"
          >
            <span className="admin-nav-icon">👥</span>
            <span>Usuarios</span>
          </button>
          
          {/* Add a new nav item for professional approvals */}
          <button
            className={`admin-nav-item ${activeTab === "approvals" ? "active" : ""}`}
            onClick={() => setActiveTab("approvals")}
            data-tab="approvals"
          >
            <span className="admin-nav-icon">✅</span>
            <span>Aprobaciones</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
            data-tab="messages"
          >
            <span className="admin-nav-icon">✉️</span>
            <span>Mensajes</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span className="admin-nav-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">
            {activeTab === "overview" && "Resumen del Panel"}
            {activeTab === "bookings" && "Gestión de Reservas"}
            {activeTab === "services" && "Gestión de Servicios"}
            {activeTab === "users" && "Gestión de Usuarios"}
            {activeTab === "approvals" && "Aprobación de Profesionales"}
            {activeTab === "messages" && "Mensajes de Contacto"}
          </h1>
          <div className="admin-header-actions">
            <button
              className="admin-action-btn"
              title="Notificaciones"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="admin-action-icon">🔔</span>
              {unreadMessages.length > 0 && <span className="notification-badge">{unreadMessages.length}</span>}
            </button>
            <button className="admin-action-btn" title="Configuración" onClick={() => setShowProfileModal(true)}>
              <span className="admin-action-icon">⚙️</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="notifications-overlay"
                onClick={() => setShowNotifications(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
              />
              <NotificationsDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                messages={messages}
                onViewMessage={(message) => {
                  setShowNotifications(false)
                  setActiveTab("messages")
                  handleOpenResponseModal(message)
                }}
              />
            </>
          )}
        </div>
        <div className="admin-main">
          {activeTab === "overview" && (
            <div className="admin-overview">
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon pending">🕒</div>
                  <div className="admin-stat-content">
                    <h3 className="admin-stat-title">Reservas Pendientes</h3>
                    <p className="admin-stat-value">{bookingStats.pending}</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon confirmed">✅</div>
                  <div className="admin-stat-content">
                    <h3 className="admin-stat-title">Reservas Confirmadas</h3>
                    <p className="admin-stat-value">{bookingStats.confirmed}</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon completed">🎉</div>
                  <div className="admin-stat-content">
                    <h3 className="admin-stat-title">Reservas Completadas</h3>
                    <p className="admin-stat-value">{bookingStats.completed}</p>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon cancelled">❌</div>
                  <div className="admin-stat-content">
                    <h3 className="admin-stat-title">Reservas Canceladas</h3>
                    <p className="admin-stat-value">{bookingStats.cancelled}</p>
                  </div>
                </div>
              </div>

              <div className="admin-overview-sections">
                <div className="admin-recent-bookings">
                  <div className="admin-section-header">
                    <h2 className="admin-section-title">Reservas Recientes</h2>
                    <button onClick={() => setActiveTab("bookings")} className="admin-view-all">
                      Ver todas
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Servicio</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>#{booking.id}</td>
                            <td>{booking.serviceName}</td>
                            <td>
                              {booking.date} {booking.time}
                            </td>
                            <td>
                              <span className={`booking-status ${booking.status}`}>
                                {booking.status === "pending" && "Pendiente"}
                                {booking.status === "confirmed" && "Confirmada"}
                                {booking.status === "completed" && "Completada"}
                                {booking.status === "cancelled" && "Cancelada"}
                              </span>
                            </td>
                            <td>
                              <div className="admin-table-actions">
                                <button
                                  className="admin-table-action-btn delete"
                                  title="Eliminar reserva"
                                  onClick={() => confirmDelete(booking.id, "booking")}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="admin-unread-messages">
                  <div className="admin-section-header">
                    <h2 className="admin-section-title">Mensajes sin Leer</h2>
                    <button onClick={() => setActiveTab("messages")} className="admin-view-all">
                      Ver todos
                    </button>
                  </div>

                  <div className="admin-messages-list">
                    {unreadMessages.length > 0 ? (
                      unreadMessages.map((message) => (
                        <div className="admin-message-card" key={message.id}>
                          <div className="admin-message-header">
                            <h3 className="admin-message-sender">{message.name}</h3>
                            <span className="admin-message-date">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="admin-message-subject">{message.subject}</p>
                          <p className="admin-message-preview">{message.message.substring(0, 100)}...</p>
                          <div className="admin-message-actions">
                            <button
                              className="admin-message-action-btn"
                              onClick={() => handleOpenResponseModal(message)}
                            >
                              Responder
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="admin-no-data">No hay mensajes sin leer</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="admin-bookings">
              <div className="admin-section-actions">
                <div className="admin-search">
                  <input
                    type="text"
                    placeholder="Buscar reservas..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="admin-search-btn">🔍</button>
                </div>
                <div className="admin-filters">
                  <select
                    className="admin-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="confirmed">Confirmadas</option>
                    <option value="completed">Completadas</option>
                    <option value="cancelled">Canceladas</option>
                  </select>
                  <input
                    type="date"
                    className="admin-date-filter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Profesional</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Pago</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>Cliente #{booking.userId}</td>
                        <td>{booking.serviceName}</td>
                        <td>{booking.professionalName}</td>
                        <td>
                          {booking.date} {booking.time}
                        </td>
                        <td>
                          <select
                            className={`booking-status-select ${booking.status}`}
                            value={booking.status}
                            onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </td>
                        <td>
                          <span className={`payment-status ${booking.paymentStatus}`}>
                            {booking.paymentStatus === "paid" && "Pagado"}
                            {booking.paymentStatus === "pending" && "Pendiente"}
                            {booking.paymentStatus === "refunded" && "Reembolsado"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="admin-table-action-btn delete"
                              title="Eliminar reserva"
                              onClick={() => confirmDelete(booking.id, "booking")}
                            >
                              🗑️
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
            <div className="admin-services">
              <div className="admin-section-actions">
                <button
                  className="admin-add-btn"
                  onClick={() =>
                    handleServiceEdit({
                      id: "",
                      name: "",
                      shortDescription: "",
                      description: "",
                      category: "corporales",
                      price: 0,
                      duration: 0,
                      image: "",
                      benefits: [],
                      includes: [],
                    })
                  }
                >
                  + Agregar Servicio
                </button>
                <div className="admin-search">
                  <input
                    type="text"
                    placeholder="Buscar servicios..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="admin-search-btn">🔍</button>
                </div>
                <div className="admin-filters">
                  <select
                    className="admin-filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="corporales">Corporales</option>
                    <option value="faciales">Faciales</option>
                    <option value="belleza">Belleza</option>
                    <option value="grupales">Grupales</option>
                  </select>
                </div>
              </div>

              <div className="admin-services-grid">
                {filteredServices.map((service) => (
                  <div className="admin-service-card" key={service.id}>
                    <div className="admin-service-image">
                      <img src={service.image || "/placeholder.svg?height=150&width=300"} alt={service.name} />
                    </div>
                    <div className="admin-service-content">
                      <h3 className="admin-service-title">{service.name}</h3>
                      <p className="admin-service-description">{service.shortDescription}</p>
                      <div className="admin-service-details">
                        <span className="admin-service-category">Categoría: {service.category}</span>
                        <span className="admin-service-price">Precio: ${service.price.toLocaleString()}</span>
                        <span className="admin-service-duration">Duración: {service.duration} min</span>
                      </div>
                      <div className="admin-service-actions">
                        <button
                          className="admin-service-action-btn view"
                          onClick={() => handleViewServiceDetails(service)}
                        >
                          Ver
                        </button>
                        <button className="admin-service-action-btn edit" onClick={() => handleServiceEdit(service)}>
                          Editar
                        </button>
                        <button
                          className="admin-service-action-btn delete"
                          onClick={() => confirmDelete(service.id, "service")}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="admin-users">
              <div className="admin-section-actions">
                <button className="admin-add-btn" onClick={() => setShowUserFormModal(true)}>
                  + Agregar Usuario
                </button>
                <div className="admin-search">
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="admin-search-btn">🔍</button>
                </div>
                <div className="admin-filters">
                  <select
                    className="admin-filter-select"
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="professional">Profesionales</option>
                    <option value="client">Clientes</option>
                  </select>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>
                          {user.firstName} {user.lastName}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`user-role ${user.role}`}>
                            {user.role === "admin" && "Administrador"}
                            {user.role === "professional" && "Profesional"}
                            {user.role === "client" && "Cliente"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="admin-table-action-btn view"
                              onClick={() => handleViewUserDetails(user)}
                              title="Ver detalles"
                            >
                              👁️
                            </button>
                            <button
                              className="admin-table-action-btn edit"
                              onClick={() => handleEditUser(user)}
                              title="Editar usuario"
                            >
                              ✏️
                            </button>
                            <button
                              className="admin-table-action-btn delete"
                              onClick={() => confirmDelete(user.id, "user")}
                              title="Eliminar usuario"
                              disabled={user.id === "1"} // Prevent deleting the main admin
                              style={user.id === "1" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                            >
                              🗑️
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
          
          {/* Add the approvals tab content */}
          {activeTab === "approvals" && (
            <div className="admin-approvals">
              <div className="admin-section-actions">
                <div className="admin-search">
                  <input
                    type="text"
                    placeholder="Buscar solicitudes..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="admin-search-btn">🔍</button>
                </div>
              </div>

              {pendingProfessionals.length > 0 ? (
                <div className="admin-approvals-grid">
                  {pendingProfessionals
                    .filter(
                      (professional) =>
                        searchTerm === "" ||
                        `${professional.firstName} ${professional.lastName}`
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        professional.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((professional) => (
                      <div className="admin-approval-card" key={professional.id}>
                        <div className="admin-approval-header">
                          <div className="admin-approval-user-info">
                            <div className="admin-approval-avatar">
                              {professional.firstName.charAt(0)}
                              {professional.lastName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="admin-approval-name">
                                {professional.firstName} {professional.lastName}
                              </h3>
                              <p className="admin-approval-date">Solicitud: {professional.requestDate}</p>
                            </div>
                          </div>
                          <div className="admin-approval-status">Pendiente</div>
                        </div>

                        <div className="admin-approval-details">
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Email:</span>
                            <span className="admin-approval-value">{professional.email}</span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Teléfono:</span>
                            <span className="admin-approval-value">{professional.phone}</span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Especialidades:</span>
                            <span className="admin-approval-value">
                              {professional.professionalInfo.specialties.join(", ")}
                            </span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Experiencia:</span>
                            <span className="admin-approval-value">{professional.professionalInfo.experience}</span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Certificación:</span>
                            <span className="admin-approval-value">{professional.professionalInfo.certification}</span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Biografía:</span>
                            <p className="admin-approval-bio">{professional.professionalInfo.bio}</p>
                          </div>
                        </div>

                        <div className="admin-approval-actions">
                          <button
                            className="admin-approval-btn reject"
                            onClick={() => handleRejectRequest(professional.id)}
                          >
                            Rechazar
                          </button>
                          <button
                            className="admin-approval-btn approve"
                            onClick={() => handleApproveRequest(professional.id)}
                          >
                            Aprobar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="admin-no-data">No hay solicitudes de profesionales pendientes</div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="admin-messages">
              <div className="admin-section-actions">
                <div className="admin-search">
                  <input
                    type="text"
                    placeholder="Buscar mensajes..."
                    className="admin-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="admin-search-btn">🔍</button>
                </div>
                <div className="admin-filters">
                  <select
                    className="admin-filter-select"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="unread">Sin leer</option>
                    <option value="read">Leídos</option>
                    <option value="responded">Respondidos</option>
                  </select>
                </div>
              </div>

              <div className="admin-messages-grid">
                {messages
                  .filter(
                    (message) =>
                      (searchTerm === "" ||
                        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        message.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
                      (statusFilter === "all" || message.status === statusFilter),
                  )
                  .map((message) => (
                    <div className={`admin-message-card ${message.status}`} key={message.id}>
                      <div className="admin-message-header">
                        <h3 className="admin-message-sender">{message.name}</h3>
                        <span className="admin-message-date">{new Date(message.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="admin-message-contact">
                        <p>
                          <strong>Email:</strong> {message.email}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {message.phone}
                        </p>
                      </div>
                      <p className="admin-message-subject">
                        <strong>Asunto:</strong> {message.subject}
                      </p>
                      <p className="admin-message-content">{message.message}</p>
                      <div className="admin-message-status">
                        <span className={`message-status ${message.status}`}>
                          {message.status === "unread" && "Sin leer"}
                          {message.status === "read" && "Leído"}
                          {message.status === "responded" && "Respondido"}
                        </span>
                      </div>
                      <div className="admin-message-actions">
                        {message.status === "unread" && (
                          <button
                            className="admin-message-action-btn"
                            onClick={() => handleMessageStatusChange(message.id, "read")}
                          >
                            Marcar como leído
                          </button>
                        )}
                        {message.status !== "responded" && (
                          <button className="admin-message-action-btn" onClick={() => handleOpenResponseModal(message)}>
                            Responder
                          </button>
                        )}
                        <button
                          className="admin-message-action-btn delete"
                          onClick={() => confirmDelete(message.id, "message")}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <SimpleModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
          onConfirm={handleDelete}
          confirmText="Eliminar"
        >
          <p>¿Estás seguro de que deseás eliminar este elemento? Esta acción no se puede deshacer.</p>
        </SimpleModal>
      )}

      {/* Service Edit Modal */}
      {showServiceEditModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal service-modal">
            <div className="admin-modal-header">
              <h2>{currentService.id ? "Editar Servicio" : "Agregar Servicio"}</h2>
            </div>
            <div className="admin-modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleServiceSave(currentService)
                }}
              >
                <div className="admin-form-group">
                  <label>Nombre del Servicio</label>
                  <input
                    type="text"
                    value={currentService.name}
                    onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descripción Corta</label>
                  <input
                    type="text"
                    value={currentService.shortDescription}
                    onChange={(e) => setCurrentService({ ...currentService, shortDescription: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descripción Completa</label>
                  <textarea
                    value={currentService.description}
                    onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Categoría</label>
                    <select
                      value={currentService.category}
                      onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                    >
                      <option value="corporales">Corporales</option>
                      <option value="faciales">Faciales</option>
                      <option value="belleza">Belleza</option>
                      <option value="grupales">Grupales</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      value={currentService.price}
                      onChange={(e) => setCurrentService({ ...currentService, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Duración (minutos)</label>
                    <input
                      type="number"
                      value={currentService.duration}
                      onChange={(e) => setCurrentService({ ...currentService, duration: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>URL de Imagen</label>
                  <input
                    type="text"
                    value={currentService.image || ""}
                    onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                    placeholder="/images/services/nombre-imagen.jpg"
                  />
                </div>
                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-modal-btn cancel"
                    onClick={() => setShowServiceEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="admin-modal-btn save">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      <ServiceDetailsModal
        isOpen={showServiceDetailsModal}
        onClose={() => setShowServiceDetailsModal(false)}
        service={currentService}
      />

      {/* Message Response Modal */}
      <MessageResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        message={currentMessage}
        onSendResponse={handleSendResponse}
      />

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showUserFormModal}
        onClose={() => setShowUserFormModal(false)}
        onSaveUser={handleAddUser}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        user={currentUser2}
      />

      {/* Profile Config Modal */}
      <ProfileConfigModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSaveProfile={handleSaveProfile}
      />
      
      {/* Success Modal */}
      <SimpleModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Operación Exitosa"
      >
        <div className="success-modal-content">
          <div className="confirmation-icon">✓</div>
          <p className="success-message">{successMessage}</p>
        </div>
      </SimpleModal>
    </div>
  )
}

export default AdminDashboard
