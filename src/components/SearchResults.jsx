"use client"

import { Link } from "react-router-dom"
import { getContentTypeLabel, CONTENT_TYPES } from "../utils/SearchUtils"
import "../styles/search-results.css"

const SearchResults = ({ results, onResultClick, query }) => {
  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-results-empty">
          <p>No se encontraron resultados para "{query}"</p>
        </div>
      </div>
    )
  }

 
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {})

  return (
    <div className="search-results-container">
      {Object.keys(groupedResults).map((type) => (
        <div key={type} className="search-results-group">
          <h3 className="search-results-group-title">{getContentTypeLabel(type)}</h3>
          <div className="search-results-list">
            {groupedResults[type].map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.path}
                className="search-result-item"
                onClick={() => onResultClick(result)}
              >
                {result.image && type === CONTENT_TYPES.SERVICE && (
                  <div className="search-result-image">
                    <img src={result.image || "/placeholder.svg"} alt={result.title} />
                  </div>
                )}
                <div className="search-result-content">
                  <h4 className="search-result-title">{result.title}</h4>
                  <p className="search-result-description">{result.description}</p>
                  {result.category && <span className="search-result-category">{result.category}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchResults
