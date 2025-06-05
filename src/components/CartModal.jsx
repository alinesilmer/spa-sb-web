"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/cart.css"

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (isOpen) {
      const savedCart = localStorage.getItem('spaCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    }
  }, [isOpen]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + Number(item.price), 0)
  }

  const getTotalDuration = () => {
    return cartItems.reduce((total, item) => total + Number(item.duration), 0)
  }

  const handleRemoveItem = (serviceId) => {
    const updatedCart = cartItems.filter(item => item.id !== serviceId);
    setCartItems(updatedCart);
    localStorage.setItem('spaCart', JSON.stringify(updatedCart));
    
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart: updatedCart } 
    }));
  }

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('spaCart');
    
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart: [] } 
    }));
  }

  const handleScheduleAndPay = () => {
    if (cartItems.length === 0) return

    navigate("/booking/cart", {
      state: {
        cartItems: cartItems,
        totalPrice: getTotalPrice(),
        totalDuration: getTotalDuration(),
      },
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Carrito de Servicios</h2>
          <button className="cart-modal-close" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-modal-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
              <p className="cart-empty-subtitle">Agregá servicios para comenzar</p>
            </div>
          ) : (
            <>
              <div className="cart-table">
                <div className="cart-table-header">
                  <div className="cart-header-image">Servicio</div>
                  <div className="cart-header-description">Descripción del Servicio</div>
                  <div className="cart-header-quantity">Cantidad</div>
                  <div className="cart-header-price">Precio</div>
                  <div className="cart-header-total">Total</div>
                  <div className="cart-header-actions"></div>
                </div>

                <div className="cart-table-body">
                  {cartItems.map((item) => (
                    <div key={item.cartId || item.id} className="cart-table-row">
                      <div className="cart-cell cart-cell-image">
                        <img
                          src={item.image || "/placeholder.svg?height=80&width=80"}
                          alt={item.name}
                          className="cart-item-img"
                        />
                      </div>
                      <div className="cart-cell cart-cell-description">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-professional">👤 {item.professional?.name}</p>
                        <p className="cart-item-duration">⏱️ {item.duration} minutos</p>
                      </div>
                      <div className="cart-cell cart-cell-quantity">
                        <div className="cart-quantity-control">
                          <span>1</span>
                        </div>
                      </div>
                      <div className="cart-cell cart-cell-price">${Number(item.price).toLocaleString()}</div>
                      <div className="cart-cell cart-cell-total">${Number(item.price).toLocaleString()}</div>
                      <div className="cart-cell cart-cell-actions">
                        <button
                          className="cart-item-remove"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Eliminar servicio"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cart-discount-section">
                <div className="cart-discount-input">
                  <label htmlFor="discount-code">Código de Descuento</label>
                  <div className="discount-input-group">
                    <input type="text" id="discount-code" placeholder="Ingresa tu código de descuento" />
                    <button className="discount-apply-btn" onClick={() => alert("Función de descuento en desarrollo")}>
                      Aplicar
                    </button>
                  </div>
                  <p className="discount-info">
                    Ingresa tu código de descuento para recibir un descuento en tu reserva.
                  </p>
                </div>
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Duración total:</span>
                  <span>{getTotalDuration()} minutos</span>
                </div>
                <div className="cart-summary-row cart-total">
                  <span>Total:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="cart-modal-actions">
                <button className="cart-back-button" onClick={onClose}>
                  Volver a la Tienda
                </button>
                <div className="cart-right-actions">
                  <button className="cart-clear-button" onClick={handleClearCart}>
                    Vaciar Carrito
                  </button>
                  <button className="cart-schedule-button" onClick={handleScheduleAndPay}>
                    Programar y Pagar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartModal
