"use client"

import { useState } from "react"
import { teamMembers, spaInfo } from "../data/mockData"
import "../styles/about-us.css"
import Video from "../components/Video";
import ScrollArrow from "../assets/scrolldown-arrow.svg"
import videoBg from "../assets/about-us-bg.mp4";
import TeamPic from "../assets/sentirsebienteam.png"

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("history")

  return (
     <div className="about-page">
      <Video videoSrc={videoBg} height="h-screen">
        <div className="container">
          <div className="text-container">
            <h1 className="about-hero-title">Sobre Nosotros</h1>
          <p className="about-hero-subtitle">Conocé nuestra historia, misión y al equipo detrás de Sentirse Bien Spa</p>
          </div>
          <h5 className="scroll-instruction">Deslizá hacia abajo</h5>
                            <img src={ScrollArrow} className="scroll-arrow"/>
        </div>
      </Video>
      

      {/* About Content */}
      <div className="about-container">
        <div className="about-tabs">
          <button
            className={`about-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Nuestra Historia
          </button>
          <button
            className={`about-tab ${activeTab === "mission" ? "active" : ""}`}
            onClick={() => setActiveTab("mission")}
          >
            Misión y Visión
          </button>
          <button
            className={`about-tab ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            Por Qué Elegirnos
          </button>
        </div>

        <div className="about-content">
          {activeTab === "history" && (
            <div className="about-history">
              <h2 className="about-section-title">Nuestra Historia</h2>
              <p className="about-text">{spaInfo.about.history}</p>
              <div className="about-image">
                <img src="https://i.pinimg.com/736x/64/6a/9f/646a9f9c3fa626141fd4da7a1003db2f.jpg" alt="Historia del Spa" />
              </div>
            </div>
          )}

          {activeTab === "mission" && (
            <div className="about-mission">
              <h2 className="about-section-title">Misión</h2>
              <p className="about-text">{spaInfo.about.mission}</p>
              <h2 className="about-section-title">Visión</h2>
              <p className="about-text">{spaInfo.about.vision}</p>
              <div className="about-image">
                <img src="https://i.pinimg.com/736x/7e/ff/9a/7eff9abafb8f41586de11e646fe669d5.jpg" alt="Misión y Visión" />
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="about-features">
              <h2 className="about-section-title">Por Qué Elegirnos</h2>
              <ul className="about-features-list">
                {spaInfo.features.map((feature, index) => (
                  <li key={index} className="about-feature-item">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="about-image">
                <img src={ TeamPic } alt="Características del Spa" className="team-img" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="team-container">
          <h2 className="team-title">Nuestro Equipo</h2>
          <p className="team-description">
            Contamos con profesionales altamente calificados y apasionados por el bienestar
          </p>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div className="team-member" key={member.id}>
                <div className="team-member-image">
                  <img src={member.image || "/placeholder.svg?height=300&width=300"} alt={member.name} />
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-position">{member.position}</p>
                <p className="team-member-bio">{member.bio}</p>
                <div className="team-member-specialties">
                  {member.specialties.map((specialty, index) => (
                    <span key={index} className="team-member-specialty">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

