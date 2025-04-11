"use client"
import "../styles/notifications.css"

const NotificationsDropdown = ({ isOpen, onClose, messages, onViewMessage }) => {
  if (!isOpen) return null

  const unreadMessages = messages.filter((msg) => msg.status === "unread")

  return (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <h3>Notificaciones</h3>
        <span className="notifications-count">{unreadMessages.length}</span>
      </div>

      <div className="notifications-content">
        {unreadMessages.length > 0 ? (
          <ul className="notifications-list">
            {unreadMessages.map((message) => (
              <li key={message.id} className="notification-item" onClick={() => onViewMessage(message)}>
                <div className="notification-icon">✉️</div>
                <div className="notification-details">
                  <div className="notification-title">{message.name}</div>
                  <div className="notification-subject">{message.subject}</div>
                  <div className="notification-time">{new Date(message.createdAt).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="notifications-empty">No hay notificaciones nuevas</div>
        )}
      </div>

      <div className="notifications-footer">
        <button
          className="notifications-view-all"
          onClick={() => {
            onClose()
            // Navigate to messages tab
            document.querySelector(`button[data-tab="messages"]`)?.click()
          }}
        >
          Ver todos los mensajes
        </button>
      </div>
    </div>
  )
}

export default NotificationsDropdown
