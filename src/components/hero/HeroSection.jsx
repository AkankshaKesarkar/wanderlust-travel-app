import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HERO_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-tropical-beach-4728-large.mp4';
const HERO_FALLBACK = 'https://assets.mixkit.co/videos/preview/mixkit-city-lights-from-above-4720-large.mp4';

const POPULAR_SEARCHES = ['Tokyo', 'Santorini', 'Bali', 'Paris', 'Machu Picchu', 'Iceland'];

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleChipClick = (term) => {
    navigate(`/explore?search=${encodeURIComponent(term)}`);
  };

  return (
    <section className="hero" aria-label="Hero section">
      {/* Background Video */}
      <div className="hero-video-wrapper" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
          <source src={HERO_FALLBACK} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-vignette" />
      </div>

      {/* Floating orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />

      {/* Content */}
      <div className="hero-content container">
        <div className="hero-badge animate-fade-in-down" aria-label="Destination count">
          <span className="hero-badge-dot" aria-hidden="true" />
          <span>20+ Handpicked Destinations</span>
        </div>

        <h1 className="hero-title animate-fade-in-up delay-100">
          Discover Your Next<br />
          <span className="hero-title-accent">Great Adventure</span>
        </h1>

        <p className="hero-subtitle animate-fade-in-up delay-200">
          Real-time weather, AI trip planning, and curated guides to the world's most stunning destinations — all in one place.
        </p>

        {/* Search */}
        <form
          className="hero-search animate-fade-in-up delay-300"
          onSubmit={handleSearch}
          role="search"
          aria-label="Search destinations"
        >
          <div className="hero-search-inner">
            <span className="hero-search-icon" aria-hidden="true">🔍</span>
            <input
              id="hero-search-input"
              type="search"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search a destination, country or vibe..."
              className="hero-search-input"
              aria-label="Search destinations"
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary hero-search-btn"
              id="hero-search-submit"
            >
              Explore
            </button>
          </div>
        </form>

        {/* Popular searches */}
        <div className="hero-chips animate-fade-in-up delay-400" aria-label="Popular destinations">
          <span className="hero-chips-label">Popular:</span>
          {POPULAR_SEARCHES.map(term => (
            <button
              key={term}
              className="hero-chip"
              onClick={() => handleChipClick(term)}
              aria-label={`Search ${term}`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator animate-bounce" aria-hidden="true">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>

      {/* Stats bar */}
      <div className="hero-stats animate-fade-in delay-500" aria-label="Site statistics">
        <div className="hero-stat">
          <strong>20+</strong>
          <span>Destinations</span>
        </div>
        <div className="hero-stat-divider" aria-hidden="true" />
        <div className="hero-stat">
          <strong>120+</strong>
          <span>Famous Places</span>
        </div>
        <div className="hero-stat-divider" aria-hidden="true" />
        <div className="hero-stat">
          <strong>Live</strong>
          <span>Weather Data</span>
        </div>
        <div className="hero-stat-divider" aria-hidden="true" />
        <div className="hero-stat">
          <strong>AI</strong>
          <span>Trip Planner</span>
        </div>
      </div>
    </section>
  );
}
