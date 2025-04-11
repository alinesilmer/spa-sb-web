
import { Link } from 'react-router-dom';
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
           <Link to="/login" className="login-btn">Iniciar Sesión</Link>
             <Link to="/register" className="register-btn">Registrarme</Link>
                  </div>
                  <h5 className="scroll-instruction">Deslizá hacia abajo</h5>
                  <img src={ScrollArrow} className="scroll-arrow"/>
        </div>
          </Video>
          {/*HOME SECTION*/}
          <div className="background-home">
              <div className="home-text-container">
              <h3 className="home-title">Pura Energía</h3>
              <h4 className="home-subtitle">Explorá el Arte del Bienestar</h4>
                  <h5 className="home-body">Descubrí el placer del descanso en nuestro Spa. <br></br>Un oasis de calma diseñado para rejuvenecerte, con terapias que renuevan cuerpo y mente.
 </h5>
                   <Link to="/services" className="home-booking-link">Ver Servicios</Link>
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
          
          
              <FAQSection />

          <div className="home-location-container">
              <Location />
          </div>

    </div>
  );
}

export default Home;

