"use client"

import { useState } from "react"
import SimpleModal from "./SimpleModal"

const MessageResponseModal = ({ isOpen, onClose, message, onSendResponse }) => {
  const [response, setResponse] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSend = () => {
    if (response.trim()) {
      onSendResponse(message.id, response)
      setResponse("")
      setShowConfirmation(true)

    
      setTimeout(() => {
        setShowConfirmation(false)
        onClose()
      }, 2000)
    }
  }

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Responder Mensaje"
      onConfirm={showConfirmation ? null : handleSend}
      confirmText={showConfirmation ? null : "Enviar"}
      cancelText={showConfirmation ? null : "Cancelar"}
    >
      {showConfirmation ? (
        <div className="response-confirmation">
          <div className="confirmation-icon">✓</div>
          <p>¡Respuesta enviada exitosamente!</p>
        </div>
      ) : (
        <>
          <div className="message-details">
            <p>
              <strong>De:</strong> {message?.name}
            </p>
            <p>
              <strong>Email:</strong> {message?.email}
            </p>
            <p>
              <strong>Asunto:</strong> {message?.subject}
            </p>
            <p>
              <strong>Mensaje:</strong> {message?.message}
            </p>
          </div>
          <div className="response-form">
            <label htmlFor="response">Tu respuesta:</label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
              placeholder="Escribí tu respuesta aquí..."
            />
          </div>
        </>
      )}
    </SimpleModal>
  )
}

export default MessageResponseModal
