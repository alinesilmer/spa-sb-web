"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { mockTimeSlots } from "../data/mockBookings"
import { services } from "../data/mockData"
import "../styles/booking.css"

const Booking = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { currentUser, isLoggedIn } = useAuth()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [error, setError] = useState("")

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/booking/${serviceId}` } })
    }
  }, [isLoggedIn, navigate, serviceId])

  // Fetch service data
  useEffect(() => {
    if (serviceId) {
      // In a real app, this would be an API call
      const foundService = services.find((s) => s.id === serviceId)
      if (foundService) {
        setService(foundService)
      } else {
        setError("Servicio no encontrado")
      }
      setLoading(false)
    }
  }, [serviceId])

  // Fetch available time slots for selected date
  useEffect(() => {
    if (selectedDate) {
      // In a real app, this would be an API call with the selected date
      // For now, we'll use mock data
      setAvailableTimeSlots(mockTimeSlots.filter((slot) => slot.available))
    }
  }, [selectedDate])

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString().split("T")[0])
    setSelectedTimeSlot(null)
  }

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!selectedTimeSlot) {
      setError("Por favor selecciona un horario")
      return
    }

    // In a real app, this would be an API call to create the booking
    const newBooking = {
      id: Math.floor(Math.random() * 1000).toString(),
      userId: currentUser.id,
      serviceId: service.id,
      serviceName: service.name,
      professionalId: "2", // Hardcoded for demo
      professionalName: "Professional User",
      date: selectedDate,
      time: selectedTimeSlot.time,
      duration: `${service.duration} minutos`,
      price: service.price,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: null,
      createdAt: new Date().toISOString(),
    }

    // Store booking data for confirmation screen
    setBookingData(newBooking)
    setBookingConfirmed(true)
  }

  // Handle payment
  const handlePayment = () => {
    // In a real app, this would integrate with MercadoPago or another payment processor
    alert("En una aplicación real, esto te llevaría a la pasarela de pago de MercadoPago")

    // Navigate to user dashboard or home
    navigate("/")
  }

  if (loading) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-loading">Cargando...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/services")} className="booking-button">
              Volver a Servicios
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (bookingConfirmed && bookingData) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-confirmation">
            <div className="booking-confirmation-header">
              <h2>Reserva Confirmada</h2>
              <p>Tu reserva ha sido creada exitosamente.</p>
            </div>

            <div className="booking-confirmation-details">
              <h3>Detalles de la Reserva</h3>

              <div className="booking-detail-item">
                <span className="booking-detail-label">Servicio:</span>
                <span className="booking-detail-value">{bookingData.serviceName}</span>
              </div>

              <div className="booking-detail-item">
                <span className="booking-detail-label">Fecha:</span>
                <span className="booking-detail-value">{bookingData.date}</span>
              </div>

              <div className="booking-detail-item">
                <span className="booking-detail-label">Hora:</span>
                <span className="booking-detail-value">{bookingData.time}</span>
              </div>

              <div className="booking-detail-item">
                <span className="booking-detail-label">Duración:</span>
                <span className="booking-detail-value">{bookingData.duration}</span>
              </div>

              <div className="booking-detail-item">
                <span className="booking-detail-label">Profesional:</span>
                <span className="booking-detail-value">{bookingData.professionalName}</span>
              </div>

              <div className="booking-detail-item">
                <span className="booking-detail-label">Precio:</span>
                <span className="booking-detail-value">${bookingData.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="booking-payment-section">
              <h3>Proceder al Pago</h3>
              <p>Para confirmar tu reserva, por favor realiza el pago.</p>
              <button onClick={handlePayment} className="booking-payment-button">
                Pagar con MercadoPago
              </button>
               <button onClick={handlePayment} className="booking-payment-button">
                Pagar con Efectivo
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {service && (
          <>
            <div className="booking-header">
              <h1>Reservar {service.name}</h1>
              <p className="booking-service-price">Precio: ${service.price.toLocaleString()}</p>
              <p className="booking-service-duration">Duración: {service.duration} minutos</p>
            </div>

            <div className="booking-content">
              <div className="booking-date-selection">
                <h2>Selecciona una Fecha</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  min={new Date().toISOString().split("T")[0]}
                  className="booking-calendar"
                />
              </div>

              <div className="booking-time-selection">
                <h2>Horarios Disponibles</h2>
                {availableTimeSlots.length > 0 ? (
                  <div className="booking-time-slots">
                    {availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`booking-time-slot ${selectedTimeSlot === slot ? "selected" : ""}`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="booking-no-slots">No hay horarios disponibles para esta fecha.</p>
                )}
              </div>
            </div>

            <div className="booking-summary">
              <h2>Resumen de la Reserva</h2>
              <div className="booking-summary-details">
                <div className="booking-summary-item">
                  <span className="booking-summary-label">Servicio:</span>
                  <span className="booking-summary-value">{service.name}</span>
                </div>
                <div className="booking-summary-item">
                  <span className="booking-summary-label">Fecha:</span>
                  <span className="booking-summary-value">
                    {new Date(selectedDate).toLocaleDateString("es-AR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="booking-summary-item">
                  <span className="booking-summary-label">Hora:</span>
                  <span className="booking-summary-value">
                    {selectedTimeSlot ? selectedTimeSlot.time : "No seleccionada"}
                  </span>
                </div>
                <div className="booking-summary-item">
                  <span className="booking-summary-label">Precio:</span>
                  <span className="booking-summary-value">${service.price.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handleConfirmBooking} className="booking-confirm-button" disabled={!selectedTimeSlot}>
                Confirmar Reserva
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Booking

