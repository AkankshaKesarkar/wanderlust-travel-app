import { Link } from 'react-router-dom';
import HeroSection from '../components/hero/HeroSection';
import DestinationGrid from '../components/destinations/DestinationGrid';
import WeatherWidget from '../components/weather/WeatherWidget';
import { useGeolocation } from '../hooks/useGeolocation';
import { useState, useEffect } from 'react';
import { geocodeCity } from '../services/geocodingService';
import './HomePage.css';

function LocationSection() {
  const { location, loading: geoLoading, error: geoError, permission, requestLocation } = useGeolocation();
  const [citySearch, setCitySearch] = useState('');
  const [weatherCoords, setWeatherCoords] = useState(null);
  const [weatherCity, setWeatherCity] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geoSearchError, setGeoSearchError] = useState(null);
  const [hasAsked, setHasAsked] = useState(false);

  useEffect(() => {
    if (location) {
      setWeatherCoords({ lat: location.lat, lon: location.lon });
    }
  }, [location]);

  const handleGeoRequest = () => {
    setHasAsked(true);
    requestLocation();
  };

  const handleCityWeather = async (e) => {
    e.preventDefault();
    if (!citySearch.trim()) return;
    setGeocoding(true);
    setGeoSearchError(null);
    const results = await geocodeCity(citySearch.trim());
    if (results.length > 0) {
      const { lat, lon } = results[0];
      setWeatherCoords({ lat, lon });
      setWeatherCity(null);
    } else {
      setGeoSearchError('City not found. Try a different name.');
    }
    setGeocoding(false);
  };

  return (
    <section className="location-section section" aria-labelledby="location-heading">
      <div className="container">
        <div className="location-inner">
          <div className="location-content">
            <span className="section-label">Location Aware</span>
            <h2 id="location-heading" className="section-title">
              Weather Where <span className="gradient-text">You Are</span>
            </h2>
            <p className="section-subtitle">
              Share your location for instant local weather, or search any city in the world.
            </p>

            {/* Permission states */}
            {permission === 'prompt' && !hasAsked && (
              <div className="location-prompt glass-card">
                <div className="location-prompt-icon" aria-hidden="true">📍</div>
                <div>
                  <p className="location-prompt-title">Enable location for personalized weather</p>
                  <p className="location-prompt-subtitle">We'll show you the weather right where you are.</p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleGeoRequest}
                  id="enable-location-btn"
                >
                  Enable Location
                </button>
              </div>
            )}

            {geoLoading && (
              <div className="location-finding" role="status" aria-live="polite">
                <span className="location-finding-spinner" aria-hidden="true" />
                Finding your location...
              </div>
            )}

            {geoError && (
              <div className="location-denied glass-card" role="alert">
                <span aria-hidden="true">🔒</span>
                <p>{geoError}</p>
              </div>
            )}

            {location && (
              <div className="location-found" role="status">
                <span aria-hidden="true">✓</span>
                <span>Location found: <strong>{location.city}{location.country ? `, ${location.country}` : ''}</strong></span>
              </div>
            )}

            {/* City search */}
            <form className="location-search" onSubmit={handleCityWeather} role="search" aria-label="Search weather by city">
              <input
                type="search"
                value={citySearch}
                onChange={e => setCitySearch(e.target.value)}
                placeholder="Search any city for weather..."
                className="location-search-input"
                aria-label="City name"
                id="location-city-search"
              />
              <button
                type="submit"
                className="btn btn-outline"
                disabled={geocoding}
                id="location-search-submit"
              >
                {geocoding ? 'Searching...' : 'Get Weather'}
              </button>
            </form>

            {geoSearchError && (
              <p className="location-search-error" role="alert">{geoSearchError}</p>
            )}
          </div>

          <div className="location-weather">
            {(weatherCoords || weatherCity) ? (
              <WeatherWidget coords={weatherCoords} cityName={weatherCity} />
            ) : (
              <div className="location-weather-placeholder glass-card" aria-label="Weather placeholder">
                <div className="location-weather-placeholder-icon" aria-hidden="true">🌍</div>
                <p>Your weather will appear here</p>
                <p className="location-weather-placeholder-sub">Enable location or search a city above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />

      {/* Featured Destinations */}
      <section className="featured-section section" aria-labelledby="featured-heading">
        <div className="container">
          <div className="featured-header">
            <div>
              <span className="section-label">Featured</span>
              <h2 id="featured-heading" className="section-title">
                Handpicked <span className="gradient-text">Destinations</span>
              </h2>
              <p className="section-subtitle">
                From ancient wonders to modern marvels — explore 20+ carefully curated destinations around the globe.
              </p>
            </div>
            <Link to="/explore" className="btn btn-outline featured-explore-btn">
              View All Destinations →
            </Link>
          </div>
          <DestinationGrid compact={true} />
          <div className="featured-cta-wrapper">
            <Link to="/explore" className="btn btn-primary btn-lg" id="featured-explore-all">
              Explore All 20+ Destinations ✈️
            </Link>
          </div>
        </div>
      </section>

      <LocationSection />

      {/* Why Wanderlust section */}
      <section className="why-section section" aria-labelledby="why-heading">
        <div className="container">
          <div className="why-header">
            <span className="section-label">Why Wanderlust</span>
            <h2 id="why-heading" className="section-title">
              Everything You Need to<br /><span className="gradient-text">Plan Your Journey</span>
            </h2>
          </div>
          <div className="why-grid">
            {[
              {
                icon: '🌍',
                title: 'Live Weather',
                desc: 'Real-time weather for every destination powered by OpenWeatherMap. Know before you go.',
              },
              {
                icon: '📸',
                title: 'Stunning Images',
                desc: 'Beautiful photography fetched live from Pexels — never a stock photo placeholder.',
              },
              {
                icon: '🤖',
                title: 'AI Trip Planner',
                desc: 'Google Gemini crafts personalized day-by-day itineraries based on your travel style.',
              },
              {
                icon: '💬',
                title: 'AI Travel Guide',
                desc: 'Ask our AI anything — hidden gems, local tips, budget advice, best time to visit.',
              },
              {
                icon: '🗺️',
                title: '120+ Famous Places',
                desc: 'Every destination features 6 curated famous places with descriptions and photography.',
              },
              {
                icon: '📍',
                title: 'Location Aware',
                desc: 'Auto-detects your location for local weather, or search any city worldwide instantly.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="why-card glass-card glass-card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="why-card-icon" aria-hidden="true">{feature.icon}</div>
                <h3 className="why-card-title">{feature.title}</h3>
                <p className="why-card-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
