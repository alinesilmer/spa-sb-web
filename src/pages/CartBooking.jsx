"use client"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAvailable } from "../services/userService"
import { createBooking } from "../services/bookingService"
import { useAuth } from "../contexts/AuthContext"
import "../styles/cart-booking.css"

// VALIDATORS
const isOnlyLetters = (str) => /^[a-zA-ZÀ-ÿ\s]+$/.test(str.trim());
const isValidCardNumber = (cardNumber) => /^\d{16}$/.test(cardNumber.trim());
const isValidExpiryDate = (expiry) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
const isValidCVV = (cvv) => /^\d{3}$/.test(cvv.trim());

const CartBooking = () => {
  const { cartItems = [] } = useLocation().state || {}
  const navigate = useNavigate()
  const { currentUser, isLoggedIn } = useAuth()
  const token = localStorage.getItem("authToken")

  const [schedules, setSchedules] = useState({})
  const [selectedDates, setSelectedDates] = useState({})
  const [selectedSlots, setSelectedSlots] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState("")

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [paymentReceipt, setPaymentReceipt] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [finalConfirmation, setFinalConfirmation] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { state: { from: "/booking/cart" } })
  }, [isLoggedIn, navigate])

  const fetchAvailability = async (serviceId, date) => {
    setLoading(prev => ({ ...prev, [serviceId]: true }))
    try {
      const res = await getAvailable(token, serviceId, date)
      const weekday = new Date(date).toLocaleDateString("es-AR", { weekday: "long" }).toLowerCase()
      const avail = res.message.availability.find(d => d.day.toLowerCase() === weekday)
      const slots = avail?.schedule || []
      setSchedules(prev => ({ ...prev, [serviceId]: slots }))
    } catch {
      setSchedules(prev => ({ ...prev, [serviceId]: [] }))
    }
    setLoading(prev => ({ ...prev, [serviceId]: false }))
  }

  const handleDateChange = (id, date) => {
    setSelectedDates(prev => ({ ...prev, [id]: date }))
    fetchAvailability(id, date)
  }

  const handleConfirmAll = async () => {
    if (!finalConfirmation) return setError("Seleccioná método de pago.")
    if (selectedPaymentMethod === "MercadoPago" && !paymentReceipt) return setError("Subí comprobante.")

    try {
      for (const item of cartItems) {
        const date = selectedDates[item.id]
        const slot = selectedSlots[item.id]
        if (!date || !slot) throw new Error("Faltan datos")

        const payload = {
          serviceId: item.id,
          date,
          hour: slot.hour,
          price: item.price,
          discountApplied: false
        }
        const res = await createBooking(token, payload)
        if (res.status !== 200) throw new Error(res.message)
      }
      localStorage.removeItem("spaCart")
      setBookingConfirmed(true)
      setTimeout(() => navigate("/"), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (selectedPaymentMethod === "MercadoPago" && !finalConfirmation) {
      if (timeLeft <= 0) {
        alert("Tiempo expirado. Volvé a reservar.")
        navigate("/services")
        return
      }
      const t = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(t)
    }
  }, [selectedPaymentMethod, timeLeft, finalConfirmation, navigate])

  const validateDebit = () => {
    if (!isValidCardNumber(cardNumber)) throw new Error("N° de tarjeta inválido (16 dígitos numéricos)");
    if (!cardName.trim() || !isOnlyLetters(cardName)) throw new Error("El nombre del titular es obligatorio y debe contener solo letras");
    if (!isValidExpiryDate(expiryDate)) throw new Error("Fecha de expiración inválida (MM/YY)");
    if (!isValidCVV(cvv)) throw new Error("CVV inválido (3 dígitos)");
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "")
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setExpiryDate(value)
  }

  if (bookingConfirmed) {
    return (
      <div className="booking-page">
        <div className="booking-confirmation">
          <div className="booking-confirmation-header">
            <h2>Reserva Exitosa</h2>
            <p>Todos los servicios fueron agendados correctamente.</p>
            <p>Serás redirigido a inicio en unos segundos.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="cart-booking-container">
        <h1>Agendá cada servicio</h1>

        {cartItems.map(item => (
          <div key={item.id} className="cart-booking-service">
            <h2>{item.name}</h2>
            <p>Profesional: {item.professional?.name}</p>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDates[item.id] || ""}
              onChange={e => handleDateChange(item.id, e.target.value)}
            />

            <div className="booking-time-selection">
              {loading[item.id] ? (
                <p>Cargando horarios…</p>
              ) : schedules[item.id]?.length > 0 ? (
                <div className="booking-time-slots">
                  {schedules[item.id].map(slot => (
                    <button
                      key={slot.hour}
                      disabled={!slot.available}
                      className={`booking-time-slot ${selectedSlots[item.id]?.hour === slot.hour ? "selected" : ""}`}
                      onClick={() => slot.available && setSelectedSlots(prev => ({ ...prev, [item.id]: slot }))}
                    >
                      {slot.hour}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="booking-no-slots">No hay horarios disponibles.</p>
              )}
            </div>
          </div>
        ))}

        <div className="booking-payment-section">
          {!selectedPaymentMethod && <h3>Seleccioná método de pago</h3>}

          <div className="booking-payment-buttons">
            <button onClick={() => setSelectedPaymentMethod("DebitCard")} className="booking-payment-button">Tarjeta</button>
            <button onClick={() => { setSelectedPaymentMethod("MercadoPago"); setTimeLeft(15 * 60) }} className="booking-payment-button">MercadoPago</button>
            <button onClick={() => setSelectedPaymentMethod("Efectivo")} className="booking-payment-button booking-cash-button">Efectivo</button>
          </div>

          {selectedPaymentMethod === "DebitCard" && (
            <div className="debit-card-form">
              <div className="form-group">
                <label>N° Tarjeta</label>
                <input
                  type="text"
                  value={cardNumber}
                  maxLength={16}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div className="form-group">
                <label>Nombre Titular</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={e => setCardName(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>MM/YY</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={expiryDate}
                    onChange={handleExpiryChange}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              {error && <div className="payment-error">{error}</div>}
              <button
                onClick={() => {
                  try {
                    validateDebit();
                    setFinalConfirmation(true)
                  } catch (e) {
                    setError(e.message)
                  }
                }}
                className="booking-payment-button"
              >
                Pagar
              </button>
            </div>
          )}

          {selectedPaymentMethod === "MercadoPago" && (
            <>
              <p>Subí comprobante. Tiempo restante: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
              <input type="file" accept="image/*" onChange={e => setPaymentReceipt(e.target.files[0])} className="booking-receipt-input" />
              {error && <div className="payment-error">{error}</div>}
              <button onClick={() => paymentReceipt ? setFinalConfirmation(true) : setError("Subí comprobante")} className="booking-payment-button">Confirmar</button>
            </>
          )}

          {selectedPaymentMethod === "Efectivo" && (
            <>
              <p>Se abonará en el local. Tené en cuenta nuestras políticas.</p>
              <button onClick={() => setFinalConfirmation(true)} className="booking-payment-button">Confirmar</button>
            </>
          )}
        </div>

        {finalConfirmation && (
          <button className="cart-booking-confirm-button" onClick={handleConfirmAll}>Confirmar todos los turnos</button>
        )}

        {error && <div className="cart-booking-error">{error}</div>}
      </div>
    </div>
  )
}

export default CartBooking;
