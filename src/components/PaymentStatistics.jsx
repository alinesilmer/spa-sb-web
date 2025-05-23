import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import "../styles/statistics.css"

const PaymentStatistics = ({ bookings = [], userRole = "client", currentUserId }) => {
  const [timeFilter, setTimeFilter] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [serviceStats, setServiceStats] = useState([])
  const [professionalStats, setProfessionalStats] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [averageBookingValue, setAverageBookingValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const COLORS = ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#5f27cd', '#ff9ff3', '#54a0ff']

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateStatistics = () => {
    console.log("Calculating statistics with:", { 
      bookingsCount: bookings?.length || 0,
      timeFilter, 
      startDate, 
      endDate, 
      userRole, 
      currentUserId 
    })
    
    setLoading(true)
    setError(null)
    
    try {
      if (!bookings || bookings.length === 0) {
        console.log("No bookings data available")
        setServiceStats([])
        setProfessionalStats([])
        setTotalRevenue(0)
        setTotalBookings(0)
        setAverageBookingValue(0)
        setLoading(false)
        return
      }

      let filteredBookings = bookings.filter(booking => {
        if (booking.status !== "completado") {
          return false
        }
        
        if (userRole === "client" && currentUserId) {
          const bookingUserId = booking.userId || booking.clientId || booking.user?.id
          if (bookingUserId !== currentUserId) {
            return false
          }
        }

        const bookingDate = new Date(booking.date)
        
        if (timeFilter === "custom" && startDate && endDate) {
          const start = new Date(startDate)
          start.setHours(0, 0, 0, 0)
          
          const end = new Date(endDate)
          end.setHours(23, 59, 59, 999)
          
          return bookingDate >= start && bookingDate <= end
        } else {
          const now = new Date()
          now.setHours(23, 59, 59, 999)
          
          if (timeFilter === "week") {
            const weekAgo = new Date()
            weekAgo.setDate(now.getDate() - 7)
            weekAgo.setHours(0, 0, 0, 0)
            return bookingDate >= weekAgo && bookingDate <= now
          } else if (timeFilter === "month") {
            const monthAgo = new Date()
            monthAgo.setMonth(now.getMonth() - 1)
            monthAgo.setHours(0, 0, 0, 0)
            return bookingDate >= monthAgo && bookingDate <= now
          } else if (timeFilter === "year") {
            const yearAgo = new Date()
            yearAgo.setFullYear(now.getFullYear() - 1)
            yearAgo.setHours(0, 0, 0, 0)
            return bookingDate >= yearAgo && bookingDate <= now
          }
        }
        
        return true
      })

      console.log(`Filtered ${filteredBookings.length} bookings out of ${bookings.length}`)

      const serviceMap = new Map()
      
      filteredBookings.forEach(booking => {
        const serviceName = booking.serviceName || booking.service?.name || "Servicio Desconocido"
        const price = typeof booking.price === 'string' 
          ? parseFloat(booking.price.replace(/[^\d.-]/g, '')) 
          : booking.price || 0
        
        if (serviceMap.has(serviceName)) {
          const existing = serviceMap.get(serviceName)
          serviceMap.set(serviceName, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1
          })
        } else {
          serviceMap.set(serviceName, {
            name: serviceName,
            totalAmount: price,
            bookingCount: 1,
            averagePrice: price
          })
        }
      })

      const professionalMap = new Map()
      
      filteredBookings.forEach(booking => {
        const professionalName = booking.professionalName || 
          (booking.professional ? 
            `${booking.professional.name} ${booking.professional.lastname || ''}`.trim() : 
            "Profesional Desconocido")
            
        const price = typeof booking.price === 'string' 
          ? parseFloat(booking.price.replace(/[^\d.-]/g, '')) 
          : booking.price || 0
        
        if (professionalMap.has(professionalName)) {
          const existing = professionalMap.get(professionalName)
          professionalMap.set(professionalName, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1
          })
        } else {
          professionalMap.set(professionalName, {
            name: professionalName,
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
        const price = typeof booking.price === 'string' 
          ? parseFloat(booking.price.replace(/[^\d.-]/g, '')) 
          : booking.price || 0
        return sum + price
      }, 0)

      const avgBookingValue = filteredBookings.length > 0 
        ? total / filteredBookings.length 
        : 0

      console.log("Statistics calculated:", {
        serviceStats: serviceStatsArray.length,
        professionalStats: professionalStatsArray.length,
        totalRevenue: total,
        totalBookings: filteredBookings.length,
        averageBookingValue: avgBookingValue
      })

      setServiceStats(serviceStatsArray)
      setProfessionalStats(professionalStatsArray)
      setTotalRevenue(total)
      setTotalBookings(filteredBookings.length)
      setAverageBookingValue(avgBookingValue)
    } catch (err) {
      console.error("Error calculating statistics:", err)
      setError("Error al calcular estadísticas. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateStatistics()
  }, [bookings, timeFilter, startDate, endDate, userRole, currentUserId])

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value)
    if (value !== "custom") {
      setStartDate("")
      setEndDate("")
    }
  }

  const exportToCSV = () => {
    try {
      let data = []
      let filename = ""
      
      if (activeTab === "services") {
        data = serviceStats.map(item => ({
          Servicio: item.name,
          "Total Facturado": item.totalAmount,
          "Cantidad de Reservas": item.bookingCount,
          "Precio Promedio": item.averagePrice
        }))
        filename = "estadisticas-servicios.csv"
      } else if (activeTab === "professionals") {
        data = professionalStats.map(item => ({
          Profesional: item.name,
          "Total Facturado": item.totalAmount,
          "Cantidad de Reservas": item.bookingCount,
          "Precio Promedio": item.averagePrice
        }))
        filename = "estadisticas-profesionales.csv"
      } else {
        data = [
          { Tipo: "Resumen", Valor: "" },
          { Tipo: "Total Facturado", Valor: totalRevenue },
          { Tipo: "Total Reservas", Valor: totalBookings },
          { Tipo: "Valor Promedio", Valor: averageBookingValue },
          { Tipo: "", Valor: "" },
          { Tipo: "Servicios", Valor: "" },
          ...serviceStats.map(item => ({
            Tipo: item.name,
            Valor: item.totalAmount
          })),
          { Tipo: "", Valor: "" },
          { Tipo: "Profesionales", Valor: "" },
          ...professionalStats.map(item => ({
            Tipo: item.name,
            Valor: item.totalAmount
          }))
        ]
        filename = "estadisticas-completas.csv"
      }
      
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map(row => 
          headers.map(header => 
            typeof row[header] === 'number' 
              ? row[header].toString() 
              : `"${row[header]}"`
          ).join(",")
        )
      ].join("\n")
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error exporting to CSV:", err)
      setError("Error al exportar datos. Por favor, intente nuevamente.")
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="statistics-container">
      <div className="statistics-card">
        <div className="statistics-header">
          <div>
            <h2>Estadísticas de Pagos</h2>
            <p className="statistics-description">
              {userRole === "admin" 
                ? "Análisis de ingresos por servicios y profesionales" 
                : "Resumen de tus pagos por servicios"}
            </p>
          </div>
          <div className="statistics-actions">
            <button 
              className="statistics-button secondary"
              onClick={calculateStatistics}
              disabled={loading}
            >
              🔄 Actualizar
            </button>
            <button 
              className="statistics-button secondary"
              onClick={exportToCSV}
              disabled={loading || serviceStats.length === 0}
            >
              📥 Exportar
            </button>
          </div>
        </div>

        {error && (
          <div className="statistics-error">
            <span className="error-icon">⚠️</span>
            <div>
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <div className="statistics-content">
          <div className="statistics-filters">
            <div className="filter-group">
              <select 
                value={timeFilter} 
                onChange={(e) => handleTimeFilterChange(e.target.value)}
                className="statistics-select"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
                <option value="custom">Período personalizado</option>
              </select>
            </div>
            
            {timeFilter === "custom" && (
              <div className="date-filters">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="statistics-date-input"
                  placeholder="Fecha inicial"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="statistics-date-input"
                  placeholder="Fecha final"
                  disabled={!startDate}
                  min={startDate}
                />
              </div>
            )}
          </div>
          
          <div className="statistics-tabs">
            <div className="tab-buttons">
              <button 
                className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Resumen
              </button>
              <button 
                className={`tab-button ${activeTab === "services" ? "active" : ""}`}
                onClick={() => setActiveTab("services")}
              >
                Servicios
              </button>
              <button 
                className={`tab-button ${activeTab === "professionals" ? "active" : ""}`}
                onClick={() => setActiveTab("professionals")}
              >
                Profesionales
              </button>
            </div>
            
            {activeTab === "overview" && (
              <div className="tab-content">
                <div className="summary-cards">
                  <div className="summary-card">
                    <h3>Total Facturado</h3>
                    {loading ? (
                      <div className="skeleton-text large"></div>
                    ) : (
                      <div className="summary-value">{formatCurrency(totalRevenue)}</div>
                    )}
                  </div>
                  
                  <div className="summary-card">
                    <h3>Total Reservas</h3>
                    {loading ? (
                      <div className="skeleton-text large"></div>
                    ) : (
                      <div className="summary-value">{totalBookings}</div>
                    )}
                  </div>
                  
                  <div className="summary-card">
                    <h3>Valor Promedio</h3>
                    {loading ? (
                      <div className="skeleton-text large"></div>
                    ) : (
                      <div className="summary-value">{formatCurrency(averageBookingValue)}</div>
                    )}
                  </div>
                </div>
                
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Top Servicios por Ingresos</h3>
                    {loading ? (
                      <div className="skeleton-chart"></div>
                    ) : serviceStats.length === 0 ? (
                      <div className="empty-state">No hay datos disponibles</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={serviceStats.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis 
                            tickFormatter={(value) => 
                              value >= 1000 
                                ? `${Math.round(value / 1000)}k` 
                                : value.toString()
                            } 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="totalAmount" fill="#ff6b6b" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  
                  <div className="chart-card">
                    <h3>Top Profesionales por Ingresos</h3>
                    {loading ? (
                      <div className="skeleton-chart"></div>
                    ) : professionalStats.length === 0 ? (
                      <div className="empty-state">No hay datos disponibles</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={professionalStats.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis 
                            tickFormatter={(value) => 
                              value >= 1000 
                                ? `${Math.round(value / 1000)}k` 
                                : value.toString()
                            } 
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="totalAmount" fill="#48dbfb" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "services" && (
              <div className="tab-content">
                <div className="statistics-table-container">
                  <h3>Estadísticas por Servicio</h3>
                  {loading ? (
                    <div className="skeleton-table">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="skeleton-row"></div>
                      ))}
                    </div>
                  ) : serviceStats.length === 0 ? (
                    <div className="empty-state">No hay datos disponibles</div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="statistics-table">
                        <thead>
                          <tr>
                            <th>Servicio</th>
                            <th>Reservas</th>
                            <th>Promedio</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {serviceStats.map((service) => (
                            <tr key={service.name}>
                              <td className="service-name">{service.name}</td>
                              <td className="text-center">{service.bookingCount}</td>
                              <td className="text-right">{formatCurrency(service.averagePrice)}</td>
                              <td className="text-right font-bold">{formatCurrency(service.totalAmount)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="total-row">
                            <td>Total</td>
                            <td className="text-center">
                              {serviceStats.reduce((sum, item) => sum + item.bookingCount, 0)}
                            </td>
                            <td className="text-right">
                              {formatCurrency(
                                serviceStats.reduce((sum, item) => sum + item.totalAmount, 0) / 
                                serviceStats.reduce((sum, item) => sum + item.bookingCount, 0)
                              )}
                            </td>
                            <td className="text-right font-bold">
                              {formatCurrency(
                                serviceStats.reduce((sum, item) => sum + item.totalAmount, 0)
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
                
                {!loading && serviceStats.length > 0 && (
                  <div className="chart-card">
                    <h3>Gráfico de Ingresos por Servicio</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={serviceStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis 
                          tickFormatter={(value) => 
                            value >= 1000 
                              ? `${Math.round(value / 1000)}k` 
                              : value.toString()
                          } 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="totalAmount" fill="#1dd1a1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "professionals" && (
              <div className="tab-content">
                <div className="statistics-table-container">
                  <h3>Estadísticas por Profesional</h3>
                  {loading ? (
                    <div className="skeleton-table">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="skeleton-row"></div>
                      ))}
                    </div>
                  ) : professionalStats.length === 0 ? (
                    <div className="empty-state">No hay datos disponibles</div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="statistics-table">
                        <thead>
                          <tr>
                            <th>Profesional</th>
                            <th>Reservas</th>
                            <th>Promedio</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {professionalStats.map((professional) => (
                            <tr key={professional.name}>
                              <td className="service-name">{professional.name}</td>
                              <td className="text-center">{professional.bookingCount}</td>
                              <td className="text-right">{formatCurrency(professional.averagePrice)}</td>
                              <td className="text-right font-bold">{formatCurrency(professional.totalAmount)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="total-row">
                            <td>Total</td>
                            <td className="text-center">
                              {professionalStats.reduce((sum, item) => sum + item.bookingCount, 0)}
                            </td>
                            <td className="text-right">
                              {formatCurrency(
                                professionalStats.reduce((sum, item) => sum + item.totalAmount, 0) / 
                                professionalStats.reduce((sum, item) => sum + item.bookingCount, 0)
                              )}
                            </td>
                            <td className="text-right font-bold">
                              {formatCurrency(
                                professionalStats.reduce((sum, item) => sum + item.totalAmount, 0)
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
                
                {!loading && professionalStats.length > 0 && (
                  <div className="chart-card">
                    <h3>Gráfico de Ingresos por Profesional</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={professionalStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis 
                          tickFormatter={(value) => 
                            value >= 1000 
                              ? `${Math.round(value / 1000)}k` 
                              : value.toString()
                          } 
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="totalAmount" fill="#feca57" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatistics
