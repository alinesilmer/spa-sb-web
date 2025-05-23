"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import "../styles/statistics.css"

const PaymentStatistics = ({ bookings = [], userRole = "client", currentUserId }) => {
  const [timeFilter, setTimeFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [serviceStats, setServiceStats] = useState([])
  const [professionalStats, setProfessionalStats] = useState([])
  const [paymentMethodStats, setPaymentMethodStats] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [averageBookingValue, setAverageBookingValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const parsePrice = (price) => {
    if (typeof price === "number") return price
    if (typeof price === "string") {
      const cleaned = price.replace(/[^\d.-]/g, "")
      return Number.parseFloat(cleaned) || 0
    }
    return 0
  }

  const calculateStatistics = () => {
    console.log("=== PAYMENT STATISTICS DEBUG ===")
    console.log("Input bookings:", bookings)
    console.log("User role:", userRole)
    console.log("Current user ID:", currentUserId)
    console.log("Time filter:", timeFilter)

    setLoading(true)
    setError(null)

    try {
      if (!bookings || bookings.length === 0) {
        console.log("No bookings available")
        resetStats()
        return
      }

      // Filter bookings based on user role and time
      const filteredBookings = bookings.filter((booking) => {
        // For client role, only show their bookings
        if (userRole === "client" && currentUserId) {
          const bookingUserId = booking.userId || booking.clientId || booking.user?.id
          if (bookingUserId && bookingUserId.toString() !== currentUserId.toString()) {
            return false
          }
        }

        // Include all bookings that have been paid for or completed
        // Don't filter by status - include all bookings with prices
        const hasPrice = booking.price || booking.amount || booking.finalPrice
        if (!hasPrice) return false

        // Time filtering
        if (timeFilter !== "all") {
          const bookingDate = new Date(booking.date)
          const now = new Date()

          if (timeFilter === "custom" && startDate && endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            return bookingDate >= start && bookingDate <= end
          } else if (timeFilter === "week") {
            const weekAgo = new Date()
            weekAgo.setDate(now.getDate() - 7)
            return bookingDate >= weekAgo
          } else if (timeFilter === "month") {
            const monthAgo = new Date()
            monthAgo.setMonth(now.getMonth() - 1)
            return bookingDate >= monthAgo
          } else if (timeFilter === "year") {
            const yearAgo = new Date()
            yearAgo.setFullYear(now.getFullYear() - 1)
            return bookingDate >= yearAgo
          }
        }

        return true
      })

      console.log("Filtered bookings:", filteredBookings)

      if (filteredBookings.length === 0) {
        console.log("No bookings after filtering")
        resetStats()
        return
      }

      // Calculate service statistics
      const serviceMap = new Map()
      filteredBookings.forEach((booking) => {
        const serviceName = booking.serviceName || booking.service?.name || "Servicio Desconocido"
        const price = parsePrice(booking.price || booking.amount || booking.finalPrice)

        if (serviceMap.has(serviceName)) {
          const existing = serviceMap.get(serviceName)
          serviceMap.set(serviceName, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1,
          })
        } else {
          serviceMap.set(serviceName, {
            name: serviceName,
            totalAmount: price,
            bookingCount: 1,
          })
        }
      })

      // Calculate professional statistics
      const professionalMap = new Map()
      filteredBookings.forEach((booking) => {
        const professionalName =
          booking.professionalName ||
          (booking.professional
            ? `${booking.professional.name} ${booking.professional.lastname || ""}`.trim()
            : "Profesional Desconocido")
        const price = parsePrice(booking.price || booking.amount || booking.finalPrice)

        if (professionalMap.has(professionalName)) {
          const existing = professionalMap.get(professionalName)
          professionalMap.set(professionalName, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1,
          })
        } else {
          professionalMap.set(professionalName, {
            name: professionalName,
            totalAmount: price,
            bookingCount: 1,
          })
        }
      })

      // Calculate payment method statistics
      const paymentMap = new Map()
      filteredBookings.forEach((booking) => {
        const paymentMethod = booking.paymentMethod || booking.payment_method || "No especificado"
        const price = parsePrice(booking.price || booking.amount || booking.finalPrice)

        if (paymentMap.has(paymentMethod)) {
          const existing = paymentMap.get(paymentMethod)
          paymentMap.set(paymentMethod, {
            ...existing,
            totalAmount: existing.totalAmount + price,
            bookingCount: existing.bookingCount + 1,
          })
        } else {
          paymentMap.set(paymentMethod, {
            name: paymentMethod,
            totalAmount: price,
            bookingCount: 1,
          })
        }
      })

      // Calculate averages
      serviceMap.forEach((value) => {
        value.averagePrice = value.totalAmount / value.bookingCount
      })

      professionalMap.forEach((value) => {
        value.averagePrice = value.totalAmount / value.bookingCount
      })

      paymentMap.forEach((value) => {
        value.averagePrice = value.totalAmount / value.bookingCount
      })

      // Sort by total amount
      const serviceStatsArray = Array.from(serviceMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
      const professionalStatsArray = Array.from(professionalMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
      const paymentMethodStatsArray = Array.from(paymentMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)

      // Calculate totals
      const total = filteredBookings.reduce((sum, booking) => {
        return sum + parsePrice(booking.price || booking.amount || booking.finalPrice)
      }, 0)

      const avgBookingValue = filteredBookings.length > 0 ? total / filteredBookings.length : 0

      console.log("=== CALCULATED STATISTICS ===")
      console.log("Service stats:", serviceStatsArray)
      console.log("Professional stats:", professionalStatsArray)
      console.log("Payment method stats:", paymentMethodStatsArray)
      console.log("Total revenue:", total)
      console.log("Total bookings:", filteredBookings.length)
      console.log("Average booking value:", avgBookingValue)

      // Update state
      setServiceStats(serviceStatsArray)
      setProfessionalStats(professionalStatsArray)
      setPaymentMethodStats(paymentMethodStatsArray)
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

  const resetStats = () => {
    setServiceStats([])
    setProfessionalStats([])
    setPaymentMethodStats([])
    setTotalRevenue(0)
    setTotalBookings(0)
    setAverageBookingValue(0)
    setLoading(false)
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
        data = serviceStats.map((item) => ({
          Servicio: item.name,
          "Total Facturado": item.totalAmount,
          "Cantidad de Reservas": item.bookingCount,
          "Precio Promedio": item.averagePrice,
        }))
        filename = "estadisticas-servicios.csv"
      } else if (activeTab === "professionals") {
        data = professionalStats.map((item) => ({
          Profesional: item.name,
          "Total Facturado": item.totalAmount,
          "Cantidad de Reservas": item.bookingCount,
          "Precio Promedio": item.averagePrice,
        }))
        filename = "estadisticas-profesionales.csv"
      } else {
        data = [
          { Tipo: "Resumen", Valor: "" },
          { Tipo: "Total Facturado", Valor: totalRevenue },
          { Tipo: "Total Reservas", Valor: totalBookings },
          { Tipo: "Valor Promedio", Valor: averageBookingValue },
        ]
        filename = "estadisticas-completas.csv"
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => (typeof row[header] === "number" ? row[header].toString() : `"${row[header]}"`))
            .join(","),
        ),
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
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
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
                ? "Análisis completo de ingresos por servicios y profesionales"
                : "Resumen de tus pagos y servicios contratados"}
            </p>
          </div>
          <div className="statistics-actions">
            <button className="statistics-button secondary" onClick={calculateStatistics} disabled={loading}>
              🔄 Actualizar
            </button>
            <button
              className="statistics-button secondary"
              onClick={exportToCSV}
              disabled={loading || (serviceStats.length === 0 && professionalStats.length === 0)}
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
                <option value="all">Todos los períodos</option>
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
              {userRole === "admin" && (
                <button
                  className={`tab-button ${activeTab === "professionals" ? "active" : ""}`}
                  onClick={() => setActiveTab("professionals")}
                >
                  Profesionales
                </button>
              )}
              <button
                className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                Métodos de Pago
              </button>
            </div>

            {activeTab === "overview" && (
              <div className="tab-content">
                <div className="summary-cards">
                  <div className="summary-card">
                    <h3>{userRole === "admin" ? "Total Facturado" : "Total Gastado"}</h3>
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
                    <h3>Top Servicios por {userRole === "admin" ? "Ingresos" : "Gastos"}</h3>
                    {loading ? (
                      <div className="skeleton-chart"></div>
                    ) : serviceStats.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay datos de servicios disponibles</p>
                        <small>Los datos aparecerán aquí cuando tengas reservas registradas</small>
                      </div>
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
                              value >= 1000 ? `${Math.round(value / 1000)}k` : value.toString()
                            }
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="totalAmount" fill="#ff6b6b" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {userRole === "admin" && (
                    <div className="chart-card">
                      <h3>Top Profesionales por Ingresos</h3>
                      {loading ? (
                        <div className="skeleton-chart"></div>
                      ) : professionalStats.length === 0 ? (
                        <div className="empty-state">
                          <p>No hay datos de profesionales disponibles</p>
                        </div>
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
                                value >= 1000 ? `${Math.round(value / 1000)}k` : value.toString()
                              }
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="totalAmount" fill="#48dbfb" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  )}

                  {userRole === "client" && (
                    <div className="chart-card">
                      <h3>Métodos de Pago Utilizados</h3>
                      {loading ? (
                        <div className="skeleton-chart"></div>
                      ) : paymentMethodStats.length === 0 ? (
                        <div className="empty-state">
                          <p>No hay datos de métodos de pago disponibles</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={paymentMethodStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis
                              tickFormatter={(value) =>
                                value >= 1000 ? `${Math.round(value / 1000)}k` : value.toString()
                              }
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="totalAmount" fill="#1dd1a1" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="tab-content">
                <div className="statistics-table-container">
                  <h3>Estadísticas por Servicio</h3>
                  {loading ? (
                    <div className="skeleton-table">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="skeleton-row"></div>
                        ))}
                    </div>
                  ) : serviceStats.length === 0 ? (
                    <div className="empty-state">
                      <p>No hay datos de servicios disponibles</p>
                      <small>Los datos aparecerán aquí cuando tengas reservas registradas</small>
                    </div>
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
                          {serviceStats.map((service, index) => (
                            <tr key={`${service.name}-${index}`}>
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
                                  serviceStats.reduce((sum, item) => sum + item.bookingCount, 0),
                              )}
                            </td>
                            <td className="text-right font-bold">
                              {formatCurrency(serviceStats.reduce((sum, item) => sum + item.totalAmount, 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "professionals" && userRole === "admin" && (
              <div className="tab-content">
                <div className="statistics-table-container">
                  <h3>Estadísticas por Profesional</h3>
                  {loading ? (
                    <div className="skeleton-table">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="skeleton-row"></div>
                        ))}
                    </div>
                  ) : professionalStats.length === 0 ? (
                    <div className="empty-state">
                      <p>No hay datos de profesionales disponibles</p>
                    </div>
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
                          {professionalStats.map((professional, index) => (
                            <tr key={`${professional.name}-${index}`}>
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
                                  professionalStats.reduce((sum, item) => sum + item.bookingCount, 0),
                              )}
                            </td>
                            <td className="text-right font-bold">
                              {formatCurrency(professionalStats.reduce((sum, item) => sum + item.totalAmount, 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="tab-content">
                <div className="statistics-table-container">
                  <h3>Estadísticas por Método de Pago</h3>
                  {loading ? (
                    <div className="skeleton-table">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="skeleton-row"></div>
                        ))}
                    </div>
                  ) : paymentMethodStats.length === 0 ? (
                    <div className="empty-state">
                      <p>No hay datos de métodos de pago disponibles</p>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="statistics-table">
                        <thead>
                          <tr>
                            <th>Método de Pago</th>
                            <th>Reservas</th>
                            <th>Promedio</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentMethodStats.map((payment, index) => (
                            <tr key={`${payment.name}-${index}`}>
                              <td className="service-name">{payment.name}</td>
                              <td className="text-center">{payment.bookingCount}</td>
                              <td className="text-right">{formatCurrency(payment.averagePrice)}</td>
                              <td className="text-right font-bold">{formatCurrency(payment.totalAmount)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="total-row">
                            <td>Total</td>
                            <td className="text-center">
                              {paymentMethodStats.reduce((sum, item) => sum + item.bookingCount, 0)}
                            </td>
                            <td className="text-right">
                              {formatCurrency(
                                paymentMethodStats.reduce((sum, item) => sum + item.totalAmount, 0) /
                                  paymentMethodStats.reduce((sum, item) => sum + item.bookingCount, 0),
                              )}
                            </td>
                            <td className="text-right font-bold">
                              {formatCurrency(paymentMethodStats.reduce((sum, item) => sum + item.totalAmount, 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatistics
