"use client"
import { useState, useEffect } from "react"
import CartModal from "./CartModal"

const CartIcon = ({ userRole }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("spaCart")
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        setCartCount(cart.length)
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()

    const handleCartUpdate = (event) => {
      setCartCount(event.detail.cart.length)
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    window.addEventListener("storage", (event) => {
      if (event.key === "spaCart") {
        updateCartCount()
      }
    })

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])

  const handleCartClick = () => {
    setIsCartOpen(true)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
  }

  const showCart = userRole === "client" || !userRole

  if (!showCart) {
    return null
  }

  return (
    <>
      <button className="cart-icon-button" onClick={handleCartClick} aria-label="Ver carrito">
        <div className="cart-icon-container">
          <svg
            className="cart-icon"
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
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
        </div>
      </button>

      <CartModal isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  )
}

export default CartIcon
