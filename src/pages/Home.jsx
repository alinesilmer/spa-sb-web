"use client";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Video from "../components/Video";
import PromCarrousel from "../components/PromCarrousel";
import FAQSection from "../components/FAQSection";
import Reviews from "../components/Reviews";
import Location from "../components/Location";

import videoBg from "../assets/home-div-bg.mp4";
import Logo from "../assets/logo-sb.png";
import PictureI from "../assets/home-picture.svg";
import ScrollArrow from "../assets/scrolldown-arrow.svg";

import "../styles/home.css";

const Home = () => {
  const { isLoggedIn } = useAuth(); // 👉 bandera real del usuario

  return (
    <div lang="en">
      {/* HERO CON VIDEO DE FONDO */}
      <Video videoSrc={videoBg} height="h-screen">
        <div className="container">
          <div className="img-container">
            <img src={Logo} className="video-logo" alt="Spa Logo" />
          </div>

          <div className="text-container">
            <h1 className="title">Sentirse Bien</h1>
            <h2 className="subtitle">Spa&nbsp;&amp;&nbsp;Bienestar</h2>
          </div>

          {/* Acceso: sólo para visitantes */}
          {!isLoggedIn && (
            <div className="btn-container">
              <Link to="/login" className="login-btn">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="register-btn">
                Registrarme
              </Link>
            </div>
          )}

          <h5 className="scroll-instruction">Deslizá hacia abajo</h5>
          <img src={ScrollArrow} className="scroll-arrow" alt="Flecha scroll" />
        </div>
      </Video>

      {/* BLOQUE “PURA ENERGÍA” */}
      <section className="background-home">
        <div className="home-text-container">
          <h3 className="home-title">Pura Energía</h3>
          <h4 className="home-subtitle">Explorá el Arte del Bienestar</h4>
          <h5 className="home-body">
            Descubrí el placer del descanso en nuestro Spa.
            <br />
            Un oasis de calma diseñado para rejuvenecerte, con terapias que
            renuevan cuerpo y mente.
          </h5>

          <Link to="/services" className="home-booking-link">
            Ver Servicios
          </Link>
        </div>

        <div className="home-img-container">
          <img
            src={PictureI}
            className="home-picture"
            alt="Ilustración bienestar"
          />
        </div>
      </section>

      {/* PROMOCIONES */}
      <section className="home-prom-container">
        <PromCarrousel />
      </section>

      {/* RESEÑAS */}
      <Reviews />

      {/* FAQ */}
      <FAQSection />

      {/* UBICACIÓN */}
      <section className="home-location-container">
        <Location />
      </section>
    </div>
  );
};

export default Home;
