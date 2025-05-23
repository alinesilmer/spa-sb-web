"use client"
import { useState, useEffect } from "react"
import "../styles/statistics.css"

const PaymentStatistics = ({ bookings, userRole, currentUserId }) => {
  const [timeFilter, setTimeFilter] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [serviceStats, setServiceStats] = useState([])
  const [professionalStats, setProfessionalStats] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const calculateStatistics = () => {
      if (!bookings || bookings.length === 0) return

      let filteredBookings = bookings.filter(booking => {
        if (booking.paymentStatus !== "paid") return false

        if (userRole === "client" && booking.clientId !== currentUserId) return false

        
        const bookingDate = new Date(booking.date)
        const now = new Date()
        
        if (timeFilter === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return bookingDate >= weekAgo
        } else if (timeFilter === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return bookingDate >= monthAgo
        } else if (timeFilter === "year") {
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          return bookingDate >= yearAgo
        } else if (timeFilter === "custom" && startDate && endDate) {
          const start = new Date(startDate)
          const end = new Date(endDate)
          return bookingDate >= start && bookingDate <= end
        }
        
        return true
      })

      
      const serviceMap = new Map()
      filteredBookings.forEach(booking => {
        const serviceName = booking.serviceName
        const price = parseFloat(booking.price) || 0
        
        if (serviceMap.has(serviceName)) {
          const existing = serviceMap.get(serviceName)
          serviceMap.set(serviceName, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1
          })
        } else {
          serviceMap.set(serviceName, {
            serviceName,
            totalAmount: price,
            bookingCount: 1,
            averagePrice: price
          })
        }
      })

      
      const professionalMap = new Map()
      filteredBookings.forEach(booking => {
        const professionalName = booking.professionalName
        const price = parseFloat(booking.price) || 0
        
        if (professionalMap.has(professionalName)) {
          const existing = professionalMap.get(professionalName)
          professionalMap.set(professionalName, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1
          })
        } else {
          professionalMap.set(professionalName, {
            professionalName,
            totalAmount: price,
            bookingCount: 1,
            averagePrice: price
          })
        }
      })

      
      serviceMap.forEach((value) => {
        value.averagePrice = value.totalAmount / value.bookingCount
      })

      professionalMap.forEach((value) => {
        value.averagePrice = value.totalAmount / value.bookingCount
      })

     
      const serviceStatsArray = Array.from(serviceMap.values())
        .sort((a, b) => b.totalAmount - a.totalAmount)
      
      const professionalStatsArray = Array.from(professionalMap.values())
        .sort((a, b) => b.totalAmount - a.totalAmount)

      
      const total = filteredBookings.reduce((sum, booking) => {
        return sum + (parseFloat(booking.price) || 0)
      }, 0)

      setServiceStats(serviceStatsArray)
      setProfessionalStats(professionalStatsArray)
      setTotalRevenue(total)
    }

    calculateStatistics()
  }, [bookings, timeFilter, startDate, endDate, userRole, currentUserId])

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case "week": return "Última Semana"
      case "month": return "Último Mes"
      case "year": return "Último Año"
      case "custom": return "Período Personalizado"
      default: return "Último Mes"
    }
  }

  return (
    <div className="payment-statistics">
      <div className="statistics-header">
        <h2 className="statistics-title">
          {userRole === "admin" ? "Estadísticas" : "Mis Pagos"}
        </h2>
        
        <div className="statistics-filters">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="time-filter-select"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mes</option>
            <option value="year">Último Año</option>
            <option value="custom">Período Personalizado</option>
          </select>

          {timeFilter === "custom" && (
            <div className="custom-date-range">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <span>hasta</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          )}
        </div>
      </div>

      <div className="statistics-summary">
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h3>Total {getTimeFilterLabel()}</h3>
            <p className="summary-amount">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="statistics-grid">
        
        <div className="statistics-section">
          <h3 className="section-title">📊 Totales por Servicio</h3>
          {serviceStats.length > 0 ? (
            <div className="statistics-table">
              <div className="table-header">
                <span>Servicio</span>
                <span>Reservas</span>
                <span>Total Pagado</span>
                <span>Promedio</span>
              </div>
              {serviceStats.map((service, index) => (
                <div key={index} className="table-row">
                  <span className="service-name">{service.serviceName}</span>
                  <span className="booking-count">{service.bookingCount}</span>
                  <span className="total-amount">${service.totalAmount.toLocaleString()}</span>
                  <span className="average-price">${service.averagePrice.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No hay datos de servicios para el período seleccionado</p>
          )}
        </div>

        <div className="statistics-section">
          <h3 className="section-title">👨‍⚕️ Totales por Profesional</h3>
          {professionalStats.length > 0 ? (
            <div className="statistics-table">
              <div className="table-header">
                <span>Profesional</span>
                <span>Reservas</span>
                <span>Total Generado</span>
                <span>Promedio</span>
              </div>
              {professionalStats.map((professional, index) => (
                <div key={index} className="table-row">
                  <span className="professional-name">{professional.professionalName}</span>
                  <span className="booking-count">{professional.bookingCount}</span>
                  <span className="total-amount">${professional.totalAmount.toLocaleString()}</span>
                  <span className="average-price">${professional.averagePrice.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No hay datos de profesionales para el período seleccionado</p>
          )}
        </div>
      </div>

      <div className="statistics-charts">
        <div className="chart-section">
          <h3 className="section-title">📈 Distribución por Servicios</h3>
          <div className="bar-chart">
            {serviceStats.slice(0, 5).map((service, index) => {
              const maxAmount = Math.max(...serviceStats.map(s => s.totalAmount))
              const percentage = (service.totalAmount / maxAmount) * 100
              
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">{service.serviceName}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">${service.totalAmount.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chart-section">
          <h3 className="section-title">👥 Distribución por Profesionales</h3>
          <div className="bar-chart">
            {professionalStats.slice(0, 5).map((professional, index) => {
              const maxAmount = Math.max(...professionalStats.map(p => p.totalAmount))
              const percentage = (professional.totalAmount / maxAmount) * 100
              
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">{professional.professionalName}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill professional" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">${professional.totalAmount.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatistics