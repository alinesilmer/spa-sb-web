"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockBookings } from "../../data/mockBookings"
import { mockContactMessages } from "../../data/mockBookings"
import { services } from "../../data/mockData"
import "../../styles/admin.css"

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
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [currentService, setCurrentService] = useState(null)

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/login")
    }
  }, [isAdmin, navigate])

  // Filter recent bookings (last 5)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Filter unread messages
  const unreadMessages = messages.filter((msg) => msg.status === "unread")

  // Count bookings by status
  const bookingStats = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    total: bookings.length,
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Handle booking status change
  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    )
  }

  // Handle message status change
  const handleMessageStatusChange = (messageId, newStatus) => {
    setMessages(
      messages.map((message) =>
        message.id === messageId ? { ...message, status: newStatus } : message
      )
    )
  }

  // Handle delete confirmation
  const confirmDelete = (id, type) => {
    setItemToDelete(id)
    setDeleteType(type)
    setShowDeleteModal(true)
  }

  // Handle actual deletion
  const handleDelete = () => {
    if (deleteType === "booking") {
      setBookings(bookings.filter((booking) => booking.id !== itemToDelete))
    } else if (deleteType === "service") {
      setServicesList(servicesList.filter((service) => service.id !== itemToDelete))
    } else if (deleteType === "message") {
      setMessages(messages.filter((message) => message.id !== itemToDelete))
    }
    setShowDeleteModal(false)
  }

  // Handle service edit/add
  const handleServiceEdit = (service) => {
    setCurrentService(service)
    setShowServiceModal(true)
  }

  // Handle service save
  const handleServiceSave = (serviceData) => {
    if (serviceData.id) {
      // Edit existing service
      setServicesList(
        servicesList.map((service) =>
          service.id === serviceData.id ? { ...serviceData } : service
        )
      )
    } else {
      // Add new service
      const newService = {
        ...serviceData,
        id: (Math.max(...servicesList.map((s) => parseInt(s.id))) + 1).toString(),
      }
      setServicesList([...servicesList, newService])
    }
    setShowServiceModal(false)
  }

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    
    const matchesDate = dateFilter === "" || booking.date === dateFilter
    
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Panel de Administración</h2>
          <div className="admin-user-info">
            <div className="admin-avatar">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture || "/placeholder.svg"} alt="Perfil" />
              ) : (
                <>
                  {currentUser?.firstName?.charAt(0)}
                  {currentUser?.lastName?.charAt(0)}
                </>
              )}
            </div>
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
          >
            <span className="admin-nav-icon">📊</span>
            <span>Resumen</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <span className="admin-nav-icon">📅</span>
            <span>Reservas</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <span className="admin-nav-icon">💆</span>
            <span>Servicios</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="admin-nav-icon">👥</span>
            <span>Usuarios</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
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
            {activeTab === "messages" && "Mensajes de Contacto"}
          </h1>
          <div className="admin-header-actions">
            <button className="admin-action-btn" title="Notificaciones">
              <span className="admin-action-icon">🔔</span>
            </button>
            <button className="admin-action-btn" title="Configuración">
              <span className="admin-action-icon">⚙️</span>
            </button>
          </div>
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
                                  className="admin-table-action-btn view" 
                                  title="Ver detalles"
                                  onClick={() => alert(`Ver detalles de la reserva #${booking.id}`)}
                                >
                                  👁️
                                </button>
                                <button 
                                  className="admin-table-action-btn edit" 
                                  title="Editar reserva"
                                  onClick={() => alert(`Editar reserva #${booking.id}`)}
                                >
                                  ✏️
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
                              onClick={() => handleMessageStatusChange(message.id, "read")}
                            >
                              Ver
                            </button>
                            <button 
                              className="admin-message-action-btn"
                              onClick={() => handleMessageStatusChange(message.id, "responded")}
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
                              className="admin-table-action-btn view" 
                              title="Ver detalles"
                              onClick={() => alert(`Ver detalles de la reserva #${booking.id}`)}
                            >
                              👁️
                            </button>
                            <button 
                              className="admin-table-action-btn edit" 
                              title="Editar reserva"
                              onClick={() => alert(`Editar reserva #${booking.id}`)}
                            >
                              ✏️
                            </button>
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
                <button className="admin-add-btn" onClick={() => handleServiceEdit({
                  id: "",
                  name: "",
                  shortDescription: "",
                  description: "",
                  category: "corporales",
                  price: 0,
                  duration: 0,
                  image: "",
                  benefits: [],
                  includes: []
                })}>
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
                  <select className="admin-filter-select">
                    <option value="all">Todas las categorías</option>
                    <option value="corporales">Corporales</option>
                    <option value="faciales">Faciales</option>
                    <option value="belleza">Belleza</option>
                    <option value="grupales">Grupales</option>
                  </select>
                </div>
              </div>

              <div className="admin-services-grid">
                {servicesList.filter(service => 
                  searchTerm === "" || 
                  service.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(service => (
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
                          onClick={() => alert(`Ver detalles de ${service.name}`)}
                        >
                          Ver
                        </button>
                        <button 
                          className="admin-service-action-btn edit"
                          onClick={() => handleServiceEdit(service)}
                        >
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
                <button className="admin-add-btn" onClick={() => alert("Agregar nuevo usuario")}>
                  + Agregar Usuario
                </button>
                <div className="admin-search">
                  <input type="text" placeholder="Buscar usuarios..." className="admin-search-input" />
                  <button className="admin-search-btn">🔍</button>
                </div>
                <div className="admin-filters">
                  <select className="admin-filter-select">
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
                    <tr>
                      <td>#1</td>
                      <td>Admin User</td>
                      <td>admin@example.com</td>
                      <td>
                        <span className="user-role admin">Administrador</span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-table-action-btn view"
                            onClick={() => alert("Ver detalles del usuario Admin")}
                          >
                            👁️
                          </button>
                          <button 
                            className="admin-table-action-btn edit"
                            onClick={() => alert("Editar usuario Admin")}
                          >
                            ✏️
                          </button>
                          <button 
                            className="admin-table-action-btn delete"
                            onClick={() => alert("No se puede eliminar el usuario administrador principal")}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>#2</td>
                      <td>Professional User</td>
                      <td>pro@example.com</td>
                      <td>
                        <span className="user-role professional">Profesional</span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-table-action-btn view"
                            onClick={() => alert("Ver detalles del usuario Professional")}
                          >
                            👁️
                          </button>
                          <button 
                            className="admin-table-action-btn edit"
                            onClick={() => alert("Editar usuario Professional")}
                          >
                            ✏️
                          </button>
                          <button 
                            className="admin-table-action-btn delete"
                            onClick={() => alert("Eliminar usuario Professional")}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>#3</td>
                      <td>Regular User</td>
                      <td>user@example.com</td>
                      <td>
                        <span className="user-role client">Cliente</span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-table-action-btn view"
                            onClick={() => alert("Ver detalles del usuario Regular")}
                          >
                            👁️
                          </button>
                          <button 
                            className="admin-table-action-btn edit"
                            onClick={() => alert("Editar usuario Regular")}
                          >
                            ✏️
                          </button>
                          <button 
                            className="admin-table-action-btn delete"
                            onClick={() => alert("Eliminar usuario Regular")}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                  .filter(message => 
                    (searchTerm === "" || 
                     message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     message.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
                    (statusFilter === "all" || message.status === statusFilter)
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
                        <button 
                          className="admin-message-action-btn"
                          onClick={() => {
                            alert(`Responder a ${message.name}`);
                            handleMessageStatusChange(message.id, "responded");
                          }}
                        >
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
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Confirmar Eliminación</h2>
            </div>
            <div className="admin-modal-content">
              <p>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-modal-btn cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="admin-modal-btn delete"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Edit/Add Modal */}
      {showServiceModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal service-modal">
            <div className="admin-modal-header">
              <h2>{currentService.id ? "Editar Servicio" : "Agregar Servicio"}</h2>
            </div>
            <div className="admin-modal-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleServiceSave(currentService);
              }}>
                <div className="admin-form-group">
                  <label>Nombre del Servicio</label>
                  <input 
                    type="text" 
                    value={currentService.name} 
                    onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descripción Corta</label>
                  <input 
                    type="text" 
                    value={currentService.shortDescription} 
                    onChange={(e) => setCurrentService({...currentService, shortDescription: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Descripción Completa</label>
                  <textarea 
                    value={currentService.description} 
                    onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Categoría</label>
                    <select 
                      value={currentService.category} 
                      onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
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
                      onChange={(e) => setCurrentService({...currentService, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Duración (minutos)</label>
                    <input 
                      type="number" 
                      value={currentService.duration} 
                      onChange={(e) => setCurrentService({...currentService, duration: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>URL de Imagen</label>
                  <input 
                    type="text" 
                    value={currentService.image || ""} 
                    onChange={(e) => setCurrentService({...currentService, image: e.target.value})}
                    placeholder="/images/services/nombre-imagen.jpg"
                  />
                </div>
                <div className="admin-modal-footer">
                  <button 
                    type="button"
                    className="admin-modal-btn cancel"
                    onClick={() => setShowServiceModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="admin-modal-btn save"
                  >
                    Guardar
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

export default AdminDashboard
