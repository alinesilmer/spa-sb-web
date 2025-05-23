"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { mockContactMessages } from "../../data/mockBookings"
import "../../styles/admin.css"
import "../../index.css"
import MessageResponseModal from "../../components/MessageResponseModal"
import UserFormModal from "../../components/UserFormModal"
import UserDetailsModal from "../../components/UserDetailsModal"
import PaymentStatistics from "../../components/PaymentStatistics"
import ProfileConfigModal from "../../components/ProfileConfigModal"
import NotificationsDropdown from "../../components/NotificationsDropdown"
import SimpleModal from "../../components/SimpleModal"
import ServiceDetailsModal from "../../components/ServiceDetailsModal"
import { getBookings, cancelBooking, confirmBooking } from "../../services/bookingService"
import {
  getUsers,
  getSpecificUser,
  updateUser,
  updateUserById,
  approveUser,
  deleteUser,
  realDeleteUser,
} from "../../services/userService"
import { registerUser } from "../../services/authService"
import { getActiveServices, updateService, deleteService, newService } from "../../services/serviceService"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout, isAdmin, setCurrentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState(mockContactMessages)
  const [servicesList, setServicesList] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [pendingProfessionals, setPendingProfessionals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToOperate, setItem] = useState(null)
  const [deleteType, setDeleteType] = useState("")
  const [currentService, setCurrentService] = useState(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [showUserFormModal, setShowUserFormModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [currentUser2, setCurrentUser2] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null)
  const [editingOwnProfile, setEditingOwnProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false)
  const [showServiceEditModal, setShowServiceEditModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login")
    }
  }, [isAdmin, navigate])

  useEffect(() => {
    if (currentUser) {
      getUserBookings()
      loadUsers()
      fetchActiveProfessionals()
      fetchPendingProfessionals()
      fetchServices()
    }
  }, [currentUser])

  const getUserBookings = async () => {
    const authToken = localStorage.getItem("authToken")
    const userBookings = await getBookings(authToken, currentUser.id)
    setBookings(userBookings.length > 0 ? userBookings : [])
  }

  const loadUsers = async () => {
    const allUsers = await getUsers()
    setUsers(allUsers.length > 0 ? allUsers : [])
  }

  const fetchServices = async () => {
    const servicesList = await getActiveServices()
    setServicesList(servicesList.length > 0 ? servicesList : [])
  }

  const fetchActiveProfessionals = async () => {
    const userType = "profesional"
    const state = true
    const data = await getSpecificUser(userType, state)
    setProfessionals(data)
  }

  const fetchPendingProfessionals = async () => {
    const userType = "profesional"
    const state = false
    const data = await getSpecificUser(userType, state)
    setPendingProfessionals(data)
  }

  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const unreadMessages = messages.filter((msg) => msg.status === "unread")
  const bookingStats = {
    pending: bookings.filter((b) => b.status === "pendiente").length,
    confirmed: bookings.filter((b) => b.status === "confirmado").length,
    completed: bookings.filter((b) => b.status === "completado").length,
    cancelled: bookings.filter((b) => b.status === "cancelado").length,
    total: bookings.length,
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const handleMessageStatusChange = (messageId, newStatus) => {
    setMessages(messages.map((message) => (message.id === messageId ? { ...message, status: newStatus } : message)))
  }

  const confirmConfirm = (id, type) => {
    setItem(id)
    setDeleteType(type)
    setShowConfirmModal(true)
  }

  const confirmCancel = (id, type) => {
    setItem(id)
    setDeleteType(type)
    setShowCancelModal(true)
  }

  const confirmDelete = (id, type) => {
    setItem(id)
    setDeleteType(type)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken")

      if (deleteType === "service") {
        await deleteService(token, itemToOperate)
        fetchServices()
      } else if (deleteType === "message") {
        setMessages(messages.filter((message) => message.id !== itemToOperate))
      } else if (deleteType === "user") {
        await deleteUser(token, itemToOperate)
      }
      setSuccessMessage("Elemento eliminado correctamente")
      setShowSuccessModal(true)
      loadUsers()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al eliminar el turno."
      setErrorMessage(errorMessage)
    } finally {
      setShowDeleteModal(false)
    }
  }

  const handleCancelBooking = async () => {
    try {
      const token = localStorage.getItem("authToken")
      await cancelBooking(token, itemToOperate)
      setSuccessMessage("Reserva cancelada correctamente")
      setShowSuccessModal(true)
      getUserBookings()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al cancelar el turno."
      setErrorMessage(errorMessage)
    } finally {
      setShowCancelModal(false)
    }
  }

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem("authToken")
      await confirmBooking(token, itemToOperate)
      setSuccessMessage("Reserva confirmada correctamente")
      setShowSuccessModal(true)
      getUserBookings()
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al confirmar el turno."
      setErrorMessage(errorMessage)
    } finally {
      setShowConfirmModal(false)
    }
  }

  const handleViewServiceDetails = (service) => {
    setCurrentService(service)
    setShowServiceDetailsModal(true)
  }

  const handleServiceEdit = (service) => {
    setCurrentService(service)
    setShowServiceEditModal(true)
  }

  const handleServiceSave = async (serviceData) => {
    try {
      const token = localStorage.getItem("authToken")

      const {
        name,
        shortDescription,
        description,
        category,
        price,
        duration,
        benefits,
        includes,
        professional,
        image,
      } = serviceData
      const payload = {
        name,
        shortDescription,
        description,
        category,
        price,
        duration,
        image: image || null,
        benefits: benefits || [],
        includes: includes || [],
        professional: professional?.id ? `/users/${professional.id}` : "",
      }

      let savedService

      if (serviceData.id) {
        savedService = await updateService(token, serviceData.id, payload)
        setSuccessMessage("Servicio actualizado correctamente")
      } else {
        savedService = await newService(token, payload)
        setSuccessMessage("Servicio creado correctamente")
      }

      savedService.price = Number(savedService.price)
      savedService.duration = Number(savedService.duration)

      setServicesList((prevList) => {
        if (serviceData.id) {
          return prevList.map((s) => (s.id === savedService.id ? savedService : s))
        } else {
          return [...prevList, savedService]
        }
      })

      setShowSuccessModal(true)
      fetchServices()
    } catch (error) {
      const message = error.response?.data?.message || "Ocurrió un error al guardar el servicio."
      setErrorMessage(message)
      setShowErrorModal(true)
    } finally {
      setShowServiceEditModal(false)
    }
  }

  const handleOpenResponseModal = (message) => {
    setCurrentMessage(message)
    setShowResponseModal(true)
  }

  const handleSendResponse = (messageId, responseText) => {
    console.log(`Sending response to message ${messageId}: ${responseText}`)
    handleMessageStatusChange(messageId, "responded")
  }

  const handleAddUser = async (userData) => {
    try {
      await registerUser(userData)
      setUsers([...users, userData])
      setSuccessMessage("Usuario agregado correctamente")
      setShowSuccessModal(true)
      loadUsers()
    } catch (error) {
      const message = error.response?.data?.message || "Error al actualizar el usuario."
      setErrorMessage(message)
      setShowErrorModal(true)
    }
  }

  const handleViewUserDetails = (user) => {
    setCurrentUser2(user)
    setShowUserDetailsModal(true)
  }

  const handleOpenOwnProfile = () => {
    setSelectedUserToEdit(currentUser)
    setEditingOwnProfile(true)
    setShowProfileModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUserToEdit(user)
    setEditingOwnProfile(false)
    setShowProfileModal(true)
  }

  const handleSaveProfile = async (updatedUser) => {
    try {
      const token = localStorage.getItem("authToken")

      if (editingOwnProfile) {
        await updateUser(token, updatedUser)
        setCurrentUser((prev) => ({ ...prev, ...updatedUser }))
      } else {
        await updateUserById(token, updatedUser.id, updatedUser)
        setCurrentUser2((prev) => ({ ...prev, ...updatedUser }))
      }

      setSuccessMessage("Perfil actualizado correctamente")
      setShowSuccessModal(true)
      loadUsers()
    } catch (error) {
      const message = error.response?.data?.message || "Error al actualizar el usuario."
      setErrorMessage(message)
      setShowErrorModal(true)
    } finally {
      setShowProfileModal(false)
    }
  }

  const handleApproveRequest = async (professionalId) => {
    try {
      const token = localStorage.getItem("authToken")
      await approveUser(token, professionalId)

      setSuccessMessage("Solicitud de profesional aprobada")
      setShowSuccessModal(true)
      fetchPendingProfessionals()
    } catch (error) {
      const message = error.response?.data?.message || "Error al aprobar la solicitud."
      setErrorMessage(message)
      setShowErrorModal(true)
    }
  }

  const handleRejectRequest = async (professionalId) => {
    try {
      const token = localStorage.getItem("authToken")
      await realDeleteUser(token, professionalId)

      setSuccessMessage("Solicitud de profesional rechazada")
      setShowSuccessModal(true)
      fetchPendingProfessionals()
    } catch (error) {
      const message = error.response?.data?.message || "Error al rechazar la solicitud."
      setErrorMessage(message)
      setShowErrorModal(true)
    }
  }

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
      `${user.name} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch = searchTerm === "" || service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category.toLowerCase() === categoryFilter
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
                {currentUser?.name} {currentUser?.lastname}
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
            <span className="admin-nav-icon">📋</span>
            <span>Resumen</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === "statistics" ? "active" : ""}`}
            onClick={() => setActiveTab("statistics")}
            data-tab="statistics"
          >
            <span className="admin-nav-icon">📊</span>
            <span>Estadísticas</span>
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
            {activeTab === "statistics" && "Estadísticas de Pagos"}
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
            <button className="admin-action-btn" title="Configuración" onClick={handleOpenOwnProfile}>
              <span className="admin-action-icon">⚙️</span>
            </button>
          </div>

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
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.serviceName}</td>
                            <td>
                              {booking.date} {booking.time}
                            </td>
                            <td>
                              <span className={`booking-status ${booking.status}`}>
                                {booking.status === "pendiente" && "Pendiente"}
                                {booking.status === "confirmado" && "Confirmada"}
                                {booking.status === "completado" && "Completada"}
                                {booking.status === "cancelado" && "Cancelada"}
                              </span>
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

          {activeTab === "statistics" && (
            <div className="admin-statistics">
              <PaymentStatistics bookings={bookings} userRole="admin" currentUserId={currentUser?.id} />
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
                    <option value="pendiente">Pendientes</option>
                    <option value="confirmado">Confirmadas</option>
                    <option value="completado">Completadas</option>
                    <option value="cancelado">Canceladas</option>
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
                        <td>{booking.id}</td>
                        <td>{booking.clientName}</td>
                        <td>{booking.serviceName}</td>
                        <td>{booking.professionalName}</td>
                        <td>
                          {booking.date} {booking.time}
                        </td>
                        <td>
                          <span className={`booking-status ${booking.status}`}>{booking.status}</span>
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
                              className="admin-table-action-btn confirm"
                              title="Confirmar reserva"
                              onClick={() => confirmConfirm(booking.id, "booking")}
                              disabled={booking.status === "confirmado"}
                              style={booking.status === "confirmado" ? { opacity: 0.3 } : {}}
                            >
                              ✅
                            </button>
                            <button
                              className="admin-table-action-btn cancel"
                              title="Cancelar reserva"
                              onClick={() => confirmCancel(booking.id, "booking")}
                              disabled={booking.status === "cancelado"}
                              style={booking.status === "cancelado" ? { opacity: 0.3 } : {}}
                            >
                              ❌
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
                      name: "",
                      shortDescription: "",
                      description: "",
                      category: "corporales",
                      price: 0,
                      duration: 0,
                      image: "",
                      benefits: [],
                      includes: [],
                      professional: "",
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
                        <span className="admin-service-price">
                          Precio: ${typeof service.price === "number" ? service.price.toLocaleString() : "N/A"}
                        </span>
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
                      <th>Estado</th>
                      <th>Nombre y Apellido</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <span className={`user-state ${user.state}`}>
                            {user.state === true && "Activo"}
                            {user.state === false && "Inactivo"}
                          </span>
                        </td>
                        <td>
                          {user.name} {user.lastname}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`user-role ${user.userType}`}>
                            {user.userType === "admin" && "Administrador"}
                            {user.userType === "profesional" && "Profesional"}
                            {user.userType === "cliente" && "Cliente"}
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
                              disabled={user.userType === "admin"}
                              style={user.userType === "admin" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
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
                        `${professional.name} ${professional.lastname}`
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        professional.email.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((professional) => (
                      <div className="admin-approval-card" key={professional.id}>
                        <div className="admin-approval-header">
                          <div className="admin-approval-user-info">
                            <div className="admin-approval-avatar">
                              {professional.name.charAt(0)}
                              {professional.lastname.charAt(0)}
                            </div>
                            <div>
                              <h3 className="admin-approval-name">
                                {professional.name} {professional.lastname}
                              </h3>
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
                            <span className="admin-approval-value">{professional.telephone || "No especificado"}</span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Especialidades:</span>
                            <span className="admin-approval-value">
                              <span className="admin-approval-value">
                                {professional.specialties.join(", ") || "No especificado"}
                              </span>
                            </span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Certificación:</span>
                            <span className="admin-approval-value">
                              {professional.certification || "No especificado"}
                            </span>
                          </div>
                          <div className="admin-approval-detail">
                            <span className="admin-approval-label">Biografía:</span>
                            <p className="admin-approval-bio">{professional.bio || "No especificado"}</p>
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
                          <strong>Teléfono:</strong> {message.telephone}
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

      {showDeleteModal && (
        <SimpleModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminacion"
          onConfirm={handleDelete}
          confirmText="Eliminar"
        >
          <p>¿Estás seguro de que deseás eliminar este elemento? Esta acción no se puede deshacer.</p>
        </SimpleModal>
      )}

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
                  <label>Beneficios</label>
                  {currentService.benefits.map((benefit, index) => (
                    <div key={index} className="admin-form-inline">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const updated = [...currentService.benefits]
                          updated[index] = e.target.value
                          setCurrentService({ ...currentService, benefits: updated })
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = currentService.benefits.filter((_, i) => i !== index)
                          setCurrentService({ ...currentService, benefits: updated })
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentService({ ...currentService, benefits: [...currentService.benefits, ""] })}
                  >
                    + Agregar Beneficio
                  </button>
                </div>
                <div className="admin-form-group">
                  <label>Incluye</label>
                  {currentService.includes.map((include, index) => (
                    <div key={index} className="admin-form-inline">
                      <input
                        type="text"
                        value={include}
                        onChange={(e) => {
                          const updated = [...currentService.includes]
                          updated[index] = e.target.value
                          setCurrentService({ ...currentService, includes: updated })
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = currentService.includes.filter((_, i) => i !== index)
                          setCurrentService({ ...currentService, includes: updated })
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentService({ ...currentService, includes: [...currentService.includes, ""] })}
                  >
                    + Agregar Elemento
                  </button>
                </div>
                <div className="admin-form-group">
                  <label>Profesional</label>
                  <select
                    value={currentService.professional?.id || ""}
                    onChange={(e) => {
                      const selectedPro = professionals.find((p) => p.id === e.target.value)
                      setCurrentService({ ...currentService, professional: selectedPro || "" })
                    }}
                    required
                  >
                    <option value="">Seleccionar profesional</option>
                    {professionals.map((pro) => (
                      <option key={pro.id} value={pro.id}>
                        {pro.lastname}, {pro.name}
                      </option>
                    ))}
                  </select>
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

      <ServiceDetailsModal
        isOpen={showServiceDetailsModal}
        onClose={() => setShowServiceDetailsModal(false)}
        service={currentService}
        showButton={false}
      />

      <MessageResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        message={currentMessage}
        onSendResponse={handleSendResponse}
      />

      <UserFormModal
        isOpen={showUserFormModal}
        onClose={() => setShowUserFormModal(false)}
        onSaveUser={handleAddUser}
      />

      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        user={currentUser2}
      />

      <ProfileConfigModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={selectedUserToEdit}
        onSaveProfile={handleSaveProfile}
      />

      <SimpleModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
        }}
        title="Operación Exitosa"
      >
        <div className="success-modal-content">
          <div className="confirmation-icon">✓</div>
          <p className="success-message">{successMessage}</p>
        </div>
      </SimpleModal>

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

export default AdminDashboard
