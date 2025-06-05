"use client"

import { useEffect } from "react"

const ChatBot = () => {
  useEffect(() => {
    console.log("🚀 Chatbot useEffect se está ejecutando")

    // Check if scripts are already loaded to avoid duplicates
    if (window.botpressWebChat) {
      console.log("✅ Botpress ya está cargado")
      return
    }

    // 1) Insert the main inject.js script (v2.5)
    const injectScript = document.createElement("script")
    injectScript.setAttribute("src", "https://cdn.botpress.cloud/webchat/v2.5/inject.js")
    injectScript.async = true

    // 2) Insert your specific bot configuration script
    const configScript = document.createElement("script")
    configScript.setAttribute("src", "https://files.bpcontent.cloud/2025/06/02/22/20250602223325-1N1VMVRP.js")
    configScript.async = true

    // Load inject script first, then config script
    injectScript.onload = () => {
      console.log("✅ inject.js v2.5 se cargó correctamente")

      // Load the config script after inject script is loaded
      configScript.onload = () => {
        console.log("✅ Config script se cargó correctamente")

        // Wait a bit for everything to initialize
        setTimeout(() => {
          if (window.botpressWebChat) {
            console.log("✅ botpressWebChat está disponible")

            // The bot should initialize automatically with the config script
            // But we can force it to show if needed
            try {
              window.botpressWebChat.sendEvent({ type: "show" })
            } catch{
              console.log("ℹ️ Bot se inicializará automáticamente")
            }
          } else {
            console.error("❌ botpressWebChat no está disponible después de cargar los scripts")
          }
        }, 1000)
      }

      configScript.onerror = () => {
        console.error("❌ Error cargando el script de configuración")
      }

      document.body.appendChild(configScript)
    }

    injectScript.onerror = () => {
      console.error("❌ Error cargando inject.js")
    }

    document.body.appendChild(injectScript)

    // Cleanup function
    return () => {
      // Remove scripts when component unmounts
      const scripts = document.querySelectorAll('script[src*="botpress"]')
      scripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })

      // Clean up global variables
      if (window.botpressWebChat) {
        try {
          window.botpressWebChat.sendEvent({ type: "hide" })
        } catch {
          console.log("Cleanup completed")
        }
      }
    }
  }, [])

  return null // No renderiza ningún elemento visible en el DOM; el widget se inyecta solo
}

export default ChatBot