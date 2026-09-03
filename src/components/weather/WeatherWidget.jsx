import { useState } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { geocodeCity } from '../../services/geocodingService';
import { getWeatherIcon, getWindDirection } from '../../services/weatherService';
import LoadingSpinner from '../ui/LoadingSpinner';
import './WeatherWidget.css';

export default function WeatherWidget({ coords = null, cityName = null, compact = false }) {
  const [searchInput, setSearchInput] = useState('');
  const [searchCoords, setSearchCoords] = useState(coords);
  const [searchCity, setSearchCity] = useState(cityName);
  const [displayCity, setDisplayCity] = useState(cityName || '');
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const { weather, loading, error } = useWeather(searchCoords, searchCity);

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setGeocoding(true);
    setGeoError(null);
    const results = await geocodeCity(searchInput.trim());
    if (results.length > 0) {
      const { lat, lon, city, country } = results[0];
      setSearchCoords({ lat, lon });
      setSearchCity(null);
      setDisplayCity(`${city}, ${country}`);
    } else {
      setGeoError('Location not found. Try another city name.');
    }
    setGeocoding(false);
  };

  const cityDisplay = weather?.city ? `${weather.city}${weather.country ? ', ' + weather.country : ''}` : (displayCity || cityName || '—');

  if (loading) {
    return (
      <div className={`weather-widget glass-card ${compact ? 'weather-compact' : ''}`} aria-label="Weather loading">
        <div className="weather-loading">
          <LoadingSpinner size="sm" label="Loading weather" />
          <span className="weather-loading-text">Fetching weather...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`weather-widget glass-card ${compact ? 'weather-compact' : ''}`} role="region" aria-label="Weather information">
      <div className="weather-header">
        <div>
          <div className="weather-location">
            <span className="weather-location-icon" aria-hidden="true">📍</span>
            <span>{cityDisplay}</span>
          </div>
          {weather?.isMock && (
            <p className="weather-mock-notice">Add an OpenWeather API key for live data</p>
          )}
        </div>
        <div className="weather-icon-large" aria-hidden="true">
          {weather ? getWeatherIcon(weather.conditionCode) : '🌡️'}
        </div>
      </div>

      {error && !weather && (
        <div className="weather-error" role="alert">⚠️ Weather data unavailable</div>
      )}

      {weather && (
        <>
          <div className="weather-main">
            <div className="weather-temp" aria-label={`Temperature: ${weather.temp} degrees Celsius`}>
              <span className="weather-temp-value">{weather.temp}</span>
              <span className="weather-temp-unit">°C</span>
            </div>
            <div className="weather-condition">
              <p className="weather-desc">{weather.condition}</p>
              <p className="weather-feels-like">Feels like {weather.feelsLike}°C</p>
              <p className="weather-range">↓{weather.tempMin}° · ↑{weather.tempMax}°</p>
            </div>
          </div>

          {!compact && (
            <div className="weather-stats" role="list">
              {[
                { icon: '💧', value: `${weather.humidity}%`, label: 'Humidity' },
                { icon: '🌬️', value: `${weather.windSpeed} km/h`, label: `Wind ${getWindDirection(weather.windDir)}` },
                { icon: '👁️', value: `${weather.visibility} km`, label: 'Visibility' },
                { icon: '🌅', value: weather.sunrise, label: 'Sunrise' },
                { icon: '🌇', value: weather.sunset, label: 'Sunset' },
                { icon: '📊', value: `${weather.pressure} hPa`, label: 'Pressure' },
              ].map(stat => (
                <div className="weather-stat" role="listitem" key={stat.label}>
                  <span className="weather-stat-icon" aria-hidden="true">{stat.icon}</span>
                  <span className="weather-stat-value">{stat.value}</span>
                  <span className="weather-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {!compact && (
            <form className="weather-search" onSubmit={handleCitySearch} role="search" aria-label="Search weather by city">
              <input
                type="search"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Check another city..."
                className="weather-search-input"
                aria-label="City name for weather lookup"
                id="weather-city-search"
              />
              <button type="submit" className="btn btn-ghost btn-sm weather-search-btn" disabled={geocoding}>
                {geocoding ? '...' : '→'}
              </button>
            </form>
          )}

          {geoError && <p className="weather-geo-error" role="alert">{geoError}</p>}
        </>
      )}
    </div>
  );
}
