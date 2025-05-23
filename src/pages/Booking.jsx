"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { getActiveServices } from "../services/serviceService"
import { getAvailable } from "../services/userService"
import { createBooking } from "../services/bookingService"
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
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [error, setError] = useState("")
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [paymentReceipt, setPaymentReceipt] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [finalConfirmation, setFinalConfirmation] = useState(false)
  
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/booking/${serviceId}` } })
    }
  }, [isLoggedIn, navigate, serviceId])

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceList = await getActiveServices()
        const foundService = serviceList.find((s) => s.id === serviceId)
  
        if (foundService) {
          setService(foundService)
          checkDiscountEligibility(foundService.price, selectedDate)
        } else {
          setError("Servicio no encontrado")
        }
      } catch (error) {
        console.error("Error al obtener servicios:", error)
        setError("Error al cargar servicios")
      } finally {
        setLoading(false)
      }
    }
  
    if (serviceId) {
      fetchService()
    }
  }, [serviceId])  

  const checkDiscountEligibility = (price, date) => {
    if (!price || !date) return
    
    const bookingDate = new Date(date)
    const now = new Date()
    
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60)
    
    if (hoursDifference >= 48) {
      const originalPrice = parseFloat(price)
      const discount = originalPrice * 0.15
      setDiscountApplied(true)
      setDiscountAmount(discount)
      setFinalPrice(originalPrice - discount)
    } else {
      setDiscountApplied(false)
      setDiscountAmount(0)
      setFinalPrice(parseFloat(price))
    }
  }

  useEffect(() => {
    if (service && service.price) {
      checkDiscountEligibility(service.price, selectedDate)
    }
  }, [selectedDate, service])

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!currentUser || !serviceId || !selectedDate) return

      try {
        const token = localStorage.getItem("authToken")

        const response = await getAvailable(token, serviceId, selectedDate)
        const weekday = new Date(selectedDate + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long" }).toLowerCase()
        
        const dayAvailability = response.message.availability.find((d) => d.day.toLowerCase() === weekday)
        if (dayAvailability && dayAvailability.schedule) {
          setAvailableTimeSlots(dayAvailability.schedule.filter((s) => s.available))
        } else {
          setAvailableTimeSlots([])
        }

      } catch (error) {
        console.error("Error al obtener disponibilidad:", error)
        setAvailableTimeSlots([])
      }
    }
  
    fetchAvailability()
  }, [selectedDate, serviceId, currentUser])

  useEffect(() => {
    if (selectedPaymentMethod === "MercadoPago" && !finalConfirmation) {
      if (timeLeft <= 0) {
        alert("El tiempo para subir el comprobante de pago ha expirado. Por favor, intentá la reserva nuevamente.")
        navigate("/services")
        return
      }
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [selectedPaymentMethod, timeLeft, finalConfirmation, navigate])

  const handleDateChange = (value) => {
    setSelectedDate(value)
    setSelectedTimeSlot(null)
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleConfirmBooking = async () => {
    try {
      setBookingInProgress(true)
      const token = localStorage.getItem("authToken")

      if (!selectedTimeSlot) {
        setError("Por favor seleccioná un horario")
        return
      }

      const newBooking = {
        serviceName: service.name,
        professionalName: service.professional.name,
        date: selectedDate,
        time: selectedTimeSlot.hour,
        duration: `${service.duration} minutos`,
        price: discountApplied ? finalPrice : service.price,
        discountApplied: discountApplied,
        originalPrice: service.price
      }

      const bookingData = {
        serviceId: service.id,
        date: selectedDate,
        hour: selectedTimeSlot.hour,
        price: discountApplied ? finalPrice : service.price,
        discountApplied: discountApplied
      }

      const response = await createBooking(token, bookingData)   
      if (response.status !== 200) {
        setError(response.message)
        return
      }

      setBookingData(newBooking)
      setBookingConfirmed(true)

    } catch (error) {
      setError(error.message)
    } finally {
      setBookingInProgress(false)
    }
  }
  
  const handleReceiptUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPaymentReceipt(file)
    }
  }

  const validateDebitCard = () => {
    if (!cardNumber || cardNumber.length < 16) {
      setError("Por favor, ingresá un número de tarjeta válido")
      return false
    }
    
    if (!cardName) {
      setError("Por favor, ingresá el nombre del titular")
      return false
    }
    
    if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError("Por favor, ingresá una fecha de vencimiento válida (MM/YY)")
      return false
    }
    
    if (!cvv || cvv.length < 3) {
      setError("Por favor, ingresá un código de seguridad válido")
      return false
    }
    
    return true
  }

  const handleDebitCardPayment = () => {
    if (!validateDebitCard()) {
      return
    }
    
    setFinalConfirmation(true)
    setTimeout(() => navigate("/"), 5000)
  }

  const handleConfirmMercadoPago = () => {
    if (!paymentReceipt) {
      setError("Por favor, subí tu comprobante de pago.")
      return
    }
    setFinalConfirmation(true)
    setTimeout(() => navigate("/"), 5000) 
  }

  const handleConfirmEfectivo = () => {
    setFinalConfirmation(true)
    setTimeout(() => navigate("/"), 5000)
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

  if (bookingConfirmed && bookingData && finalConfirmation) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-confirmation">
            <div className="booking-confirmation-header">
              <h2>Reserva Exitosa</h2>
              <p>Tu reserva ha sido confirmada. Serás redirigido a Inicio en unos momentos.</p>
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
              {discountApplied && (
                <>
                  <div className="booking-detail-item">
                    <span className="booking-detail-label">Precio Original:</span>
                    <span className="booking-detail-value booking-price-original">${bookingData.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="booking-detail-item">
                    <span className="booking-detail-label">Descuento (15%):</span>
                    <span className="booking-detail-value booking-price-discount">-${discountAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="booking-detail-item">
                <span className="booking-detail-label">Precio Final:</span>
                <span className="booking-detail-value booking-price-final">${bookingData.price.toLocaleString()}</span>
              </div>
            </div>
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
              <p>Revisá los detalles de tu reserva y procedé al pago.</p>
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
              {discountApplied && (
                <>
                  <div className="booking-detail-item">
                    <span className="booking-detail-label">Precio Original:</span>
                    <span className="booking-detail-value booking-price-original">${bookingData.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="booking-detail-item">
                    <span className="booking-detail-label">Descuento (15%):</span>
                    <span className="booking-detail-value booking-price-discount">-${discountAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="booking-detail-item">
                <span className="booking-detail-label">Precio Final:</span>
                <span className="booking-detail-value booking-price-final">${bookingData.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="booking-payment-section">
              {!selectedPaymentMethod && (
                <>
                  <h3>Proceder al Pago</h3>
                  <p>Seleccioná tu método de pago.</p>
                  
                  {discountApplied && (
                    <div className="booking-discount-notice">
                      <span className="discount-icon">🎉</span>
                      <p>¡Felicitaciones! Has obtenido un 15% de descuento por reservar con más de 48 horas de anticipación.</p>
                    </div>
                  )}
                  
                  <div className="booking-payment-buttons">
                    <button
                      onClick={() => setSelectedPaymentMethod("DebitCard")}
                      className="booking-payment-button"
                    >
                      Pagar con Tarjeta de Débito
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPaymentMethod("MercadoPago")
                        setTimeLeft(15 * 60)
                      }}
                      className="booking-payment-button"
                    >
                      Pagar con MercadoPago
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod("Efectivo")}
                      className="booking-payment-button booking-cash-button"
                    >
                      Pagar con Efectivo
                    </button>
                  </div>
                </>
              )}

              {selectedPaymentMethod === "DebitCard" && (
                <>
                  <h3>Pagar con Tarjeta de Débito</h3>
                  <div className="debit-card-form">
                    <div className="form-group">
                      <label>Número de Tarjeta</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        maxLength={16}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nombre del Titular</label>
                      <input 
                        type="text" 
                        placeholder="Como aparece en la tarjeta" 
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha de Vencimiento</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={expiryDate}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d/]/g, '')
                            if (value.length <= 5) {
                              setExpiryDate(value)
                            }
                          }}
                          maxLength={5}
                        />
                      </div>
                      <div className="form-group">
                        <label>Código de Seguridad</label>
                        <input 
                          type="text" 
                          placeholder="CVV" 
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          maxLength={3}
                        />
                      </div>
                    </div>
                    
                    {error && <div className="payment-error">{error}</div>}
                    
                    <button onClick={handleDebitCardPayment} className="booking-payment-button">
                      Pagar 
                    </button>
                  </div>
                </>
              )}

              {selectedPaymentMethod === "MercadoPago" && (
                <>
                  <h3>Pagar con MercadoPago</h3>
                  <p>
                    Subí tu comprobante de pago. Tenés{" "}
                    {Math.floor(timeLeft / 60)} minutos {timeLeft % 60} segundos para hacerlo.
                  </p>
                  <input
                    type="file"
                    onChange={handleReceiptUpload}
                    accept="image/*"
                    className="booking-receipt-input"
                  />
                  {paymentReceipt && <p>Comprobante subido: {paymentReceipt.name}</p>}
                  <button onClick={handleConfirmMercadoPago} className="booking-payment-button">
                    Confirmar Comprobante
                  </button>
                </>
              )}

              {selectedPaymentMethod === "Efectivo" && (
                <>
                  <h3>Pagar con Efectivo</h3>
                  <p>
                    Al elegir pagar en efectivo, tu reserva queda registrada, pero recordá que solo podés cancelarla a través
                    de tu cuenta y con 24 horas de anticipación. De lo contrario, se deberá abonar la cantidad total igualmente. Si no abonás el pago,
                    no podrás reservar nuevamente en el spa.
                  </p>
                  {discountApplied && (
                    <div className="booking-discount-notice warning">
                      <span className="discount-icon">⚠️</span>
                      <p>Al pagar en efectivo, no se aplica el descuento del 15%. El precio a pagar será el precio de lista: ${bookingData.originalPrice.toLocaleString()}</p>
                    </div>
                  )}
                  <button onClick={handleConfirmEfectivo} className="booking-payment-button">
                    Aceptar y Confirmar Reserva
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="booking-container" style={{ position: 'relative' }}>
        {bookingInProgress && (
          <div className="loader-overlay">
            <div className="loader-box">
              <div className="loader-spinner"></div>
              <p>Procesando reserva...</p>
            </div>
          </div>
        )}
        
        {service && (
          <>
            <div className="booking-header">
              <h1>Reservar {service.name}</h1>
              <p className="booking-service-price">Profesional: {service.professional.name}</p>
              
              {discountApplied ? (
                <div className="booking-price-container">
                  <p className="booking-service-price original">
                    Precio Original: <span className="price-strikethrough">${typeof service.price === "number" ? service.price.toLocaleString() : "N/A"}</span>
                  </p>
                  <p className="booking-service-discount">
                    Descuento (15%): -${discountAmount.toLocaleString()}
                  </p>
                  <p className="booking-service-price discounted">
                    Precio Final: ${finalPrice.toLocaleString()} <span className="discount-badge">¡15% OFF!</span>
                  </p>
                  <p className="booking-discount-info">
                    <span className="discount-icon"></span> Descuento aplicado por reservar con más de 48 horas  <br /> de anticipación y pagar con tarjeta de débito.
                  </p>
                </div>
              ) : (
                <p className="booking-service-price">Precio: ${typeof service.price === "number" ? service.price.toLocaleString() : "N/A"}</p>
              )}
              
              <p className="booking-service-duration">Duración: {service.duration} minutos</p>
            </div>

            <div className="booking-content">
              <div className="booking-date-selection">
                <h2>Seleccioná una Fecha</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
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
                        className={`booking-time-slot ${
                          selectedTimeSlot === slot ? "selected" : ""
                        }`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot.hour}
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
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-AR", {
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
                    {selectedTimeSlot ? selectedTimeSlot.hour : "No seleccionada"}
                  </span>
                </div>
                <div className="booking-summary-item">
                  <span className="booking-summary-label">Precio:</span>
                  {discountApplied ? (
                    <span className="booking-summary-value">
                      <span className="price-strikethrough">${typeof service.price === "number" ? service.price.toLocaleString() : "N/A"}</span>
                      {" "}
                      <span className="discounted-price">${finalPrice.toLocaleString()}</span>
                      {" "}
                      <span className="discount-badge">¡15% OFF!</span>
                    </span>
                  ) : (
                    <span className="booking-summary-value">${typeof service.price === "number" ? service.price.toLocaleString() : "N/A"}</span>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                className="booking-confirm-button"
                disabled={!selectedTimeSlot}
              >
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
