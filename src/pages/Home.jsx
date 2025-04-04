
import Video from "../components/Video";
import videoBg from "../assets/home-div-bg.mp4";
import Logo from "../assets/logo-sb.png";
import '../styles/home.css';
import PictureI from "../assets/home-picture.svg"
import PromCarrousel from "../components/PromCarrousel"; 
import ScrollArrow from "../assets/scrolldown-arrow.svg"
import FAQSection from "../components/FAQSection";
import Reviews from "../components/Reviews";
import Location from "../components/Location";


const Home = () => {
  return (
    <div lang="en">
      <Video videoSrc={videoBg} height="h-screen">
        <div className="container">
          <div className="img-container">
            <img src={Logo} className="video-logo" alt="Spa Logo" />
          </div>
          <div className="text-container">
            <h1 className="title">Sentirse Bien</h1>
            <h2 className="subtitle">Spa & Bienestar</h2>
          </div>
          <div className="btn-container">
            <a className="login-btn">Iniciar Sesión</a>
            <a className="register-btn">Registrarme</a>
                  </div>
                  <h5 className="scroll-instruction">Deslizá hacia abajo</h5>
                  <img src={ScrollArrow} className="scroll-arrow"/>
        </div>
          </Video>
          {/*HOME SECTION*/}
          <div className="background-home">
              <div className="home-text-container">
              <h3 className="home-title">Pura Energía</h3>
              <h4 className="home-subtitle">Explora el Arte del Bienestar</h4>
                  <h5 className="home-body">Descubre el placer del descanso en nuestro Spa. <br></br>Un oasis de calma diseñado para rejuvenecerte, con terapias que renuevan cuerpo y mente.
 </h5>
                   <a href="#reservas" className="home-booking-link">Reservar Ya</a>
              </div>
    
              <div className="home-img-container">
                  <img src={PictureI} className="home-picture" alt="home-picture"></img>
                  </div>
          </div>
          
          <div className="home-prom-container">
              {/*make the carrousel work please*/}
              <PromCarrousel />
          </div>

          
          <Reviews />
          
           <div className="faq-container">
              <div className="faq-text-container">
              <h3 className="home-faq-title">Preguntas Frecuentes</h3>
              <h5 className="home-faq-body">Consultá nuestras preguntas frecuentes <br></br>para obtener respuestas rápidas y útiles.</h5>
              <h5 className="home-faq-body">Si no encontrás lo que buscas<br></br> consultá a <a href="#Contact" className="faq-consult-link"> nuestro equipo</a></h5>
              </div>
              <FAQSection />
          </div>

          <div className="home-location-container">
              <Location />
          </div>

    </div>
  );
}

export default Home;

