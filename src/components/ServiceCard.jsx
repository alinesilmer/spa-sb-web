"use client"
import { useState, useEffect } from "react"
import "../styles/service-card.css"

const ServiceCard = ({ service, onViewMore, onBooking, userRole }) => {
  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    const checkCartStatus = () => {
      const savedCart = localStorage.getItem("spaCart")
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        setIsInCart(cart.some((item) => item.id === service.id))
      } else {
        setIsInCart(false)
      }
    }

    checkCartStatus()

    const handleCartUpdate = (event) => {
      const updatedCart = event.detail.cart
      setIsInCart(updatedCart.some((item) => item.id === service.id))
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    window.addEventListener("storage", (event) => {
      if (event.key === "spaCart") {
        checkCartStatus()
      }
    })

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", checkCartStatus)
    }
  }, [service.id])

  const handleAddToCart = () => {
    if (isInCart) return 

    const cartItem = {
      id: service.id,
      cartId: `cart-${service.id}-${Date.now()}`,
      name: service.name,
      price: service.price,
      duration: service.duration,
      professional: service.professional,
      image: service.image || "/placeholder.svg?height=80&width=80",
      addedAt: new Date().toISOString(),
    }

    const savedCart = localStorage.getItem("spaCart")
    const currentCart = savedCart ? JSON.parse(savedCart) : []

  
    if (!currentCart.some((item) => item.id === service.id)) {
      const updatedCart = [...currentCart, cartItem]
      localStorage.setItem("spaCart", JSON.stringify(updatedCart))
      setIsInCart(true)

      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cart: updatedCart },
        }),
      )
    }
  }

  const showCartFeatures = userRole === "client" || !userRole

  return (
    <div className="service-card">
      <div className="service-card-image">
        <img
          src={service.image || "/placeholder.svg?height=300&width=400"}
          alt={service.name}
          className="responsive-image"
        />
        {showCartFeatures && (
          <button
            className={`service-card-add-cart ${isInCart ? "in-cart" : ""}`}
            onClick={handleAddToCart}
            disabled={isInCart}
            aria-label={isInCart ? "Ya está en el carrito" : "Agregar al carrito"}
            title={isInCart ? "Ya está en el carrito" : "Agregar al carrito"}
          >
            {isInCart ? (
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
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            ) : (
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
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="service-card-content">
        <h3 className="service-card-title">{service.name}</h3>
        <p className="service-card-description">{service.shortDescription}</p>

        <div className="service-card-details">
          <span className="service-card-price">${service.price.toLocaleString()}</span>
          <span className="service-card-duration">{service.duration}min</span>
        </div>

        <div className="service-card-actions">
          <button className="service-card-view-more" onClick={() => onViewMore(service)}>
            Ver Más
          </button>

          <button className="service-card-book-now" onClick={() => onBooking(service)}>
            Reservar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard

