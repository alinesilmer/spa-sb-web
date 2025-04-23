// Search utilities for global search functionality

// Define searchable content types
const CONTENT_TYPES = {
  SERVICE: "service",
  PAGE: "page",
  TEAM: "team",
  BLOG: "blog",
}

// Main pages in the application
const pages = [
  { id: "home", title: "Inicio", path: "/", keywords: ["home", "inicio", "principal", "spa"] },
  { id: "about", title: "Nosotros", path: "/about-us", keywords: ["about", "nosotros", "equipo", "historia", "sobre"] },
  {
    id: "services",
    title: "Servicios",
    path: "/services",
    keywords: ["servicios", "tratamientos", "masajes", "belleza"],
  },
  {
    id: "contact",
    title: "Contacto",
    path: "/contact",
    keywords: ["contacto", "ubicación", "teléfono", "email", "dirección"],
  },
  { id: "booking", title: "Reservas", path: "/booking", keywords: ["reservas", "citas", "agendar", "booking"] },
  { id: "login", title: "Iniciar Sesión", path: "/login", keywords: ["login", "iniciar sesión", "acceso", "cuenta"] },
  {
    id: "register",
    title: "Registrarse",
    path: "/register",
    keywords: ["registro", "crear cuenta", "sign up", "registrarse"],
  },
]

/**
 * Search across all content types
 * @param {string} query - The search query
 * @param {Object} data - Object containing arrays of different content types
 * @returns {Array} - Array of search results
 */
export const globalSearch = (query, data) => {
  if (!query || query.trim() === "") {
    return []
  }

  const normalizedQuery = query.toLowerCase().trim()
  const results = []

  // Search in services
  if (data.services && Array.isArray(data.services)) {
    const serviceResults = data.services
      .filter(
        (service) =>
          service?.name?.toLowerCase().includes(normalizedQuery) ||
          service?.shortDescription?.toLowerCase().includes(normalizedQuery) ||
          service?.description?.toLowerCase().includes(normalizedQuery) ||
          service?.category?.toLowerCase().includes(normalizedQuery),
      )
      .map((service) => ({
        id: service?.id,
        type: CONTENT_TYPES.SERVICE,
        title: service?.name,
        description: service?.shortDescription,
        path: `/services?highlight=${service?.id}`,
        image: service?.image,
        category: service?.category,
      }))

    results.push(...serviceResults)
  }

  // Search in team members
  if (data.teamMembers && Array.isArray(data.teamMembers)) {
    const teamResults = data.teamMembers
      .filter(
        (member) =>
          member?.name?.toLowerCase().includes(normalizedQuery) ||
          member?.certification?.toLowerCase().includes(normalizedQuery) ||
          member?.bio?.toLowerCase().includes(normalizedQuery) ||
          (member?.specialties && member?.specialties?.some((s) => s.toLowerCase().includes(normalizedQuery))),
      )
      .map((member) => ({
        id: member?.id,
        type: CONTENT_TYPES.TEAM,
        title: member?.name,
        description: member?.certification,
        path: `/about-us?highlight=${member?.id}`,
        image: member?.image,
      }))

    results.push(...teamResults)
  }

  // Search in pages
  const pageResults = pages
    .filter(
      (page) =>
        page?.title?.toLowerCase().includes(normalizedQuery) ||
        page?.keywords?.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)),
    )
    .map((page) => ({
      id: page?.id,
      type: CONTENT_TYPES.PAGE,
      title: page?.title,
      description: `Página de ${page?.title}`,
      path: page?.path,
    }))

  results.push(...pageResults)

  return results
}

/**
 * Get content type label in Spanish
 * @param {string} type - Content type
 * @returns {string} - Label in Spanish
 */
export const getContentTypeLabel = (type) => {
  switch (type) {
    case CONTENT_TYPES.SERVICE:
      return "Servicio"
    case CONTENT_TYPES.PAGE:
      return "Página"
    case CONTENT_TYPES.TEAM:
      return "Equipo"
    case CONTENT_TYPES.BLOG:
      return "Blog"
    default:
      return "Otro"
  }
}

export { CONTENT_TYPES }
