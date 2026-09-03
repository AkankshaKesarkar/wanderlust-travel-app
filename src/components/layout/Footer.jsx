import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-gradient" aria-hidden="true" />
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Wanderlust home">
            <span className="footer-logo-icon" aria-hidden="true">✦</span>
            <span>Wanderlust</span>
          </Link>
          <p className="footer-tagline">
            Explore the world, one destination at a time.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h3 className="footer-col-title">Explore</h3>
            <Link to="/explore" className="footer-link">All Destinations</Link>
            <Link to="/explore?continent=Europe" className="footer-link">Europe</Link>
            <Link to="/explore?continent=Asia" className="footer-link">Asia</Link>
            <Link to="/explore?continent=Americas" className="footer-link">Americas</Link>
          </div>
          <div className="footer-col">
            <h3 className="footer-col-title">APIs Used</h3>
            <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="footer-link">OpenWeatherMap</a>
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="footer-link">Pexels</a>
            <a href="https://deepmind.google/gemini" target="_blank" rel="noopener noreferrer" className="footer-link">Google Gemini</a>
            <a href="https://nominatim.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="footer-link">OpenStreetMap</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">
            © {year} Wanderlust — Built for the Front-End Technical Assessment
          </p>
          <p className="footer-credits">
            Images by <a href="https://pexels.com" className="footer-link-inline" target="_blank" rel="noopener noreferrer">Pexels</a>
            {' · '}
            Weather by <a href="https://openweathermap.org" className="footer-link-inline" target="_blank" rel="noopener noreferrer">OpenWeather</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
