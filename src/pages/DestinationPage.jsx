import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDestinationById } from '../data/destinations';
import { useImages, useSingleImage } from '../hooks/useImages';
import PlaceCard from '../components/places/PlaceCard';
import WeatherWidget from '../components/weather/WeatherWidget';
import ChatBot from '../components/chatbot/ChatBot';
import ItineraryPlanner from '../components/chatbot/ItineraryPlanner';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import './DestinationPage.css';

function HeroImage({ destination }) {
  const { image, loading } = useSingleImage(`${destination.name} ${destination.country} landscape travel`);
  const [imgError, setImgError] = useState(false);

  if (loading) {
    return <div className="dest-page-hero-img skeleton" aria-hidden="true" />;
  }

  if (image && !imgError) {
    return (
      <img
        src={image.url}
        alt={`${destination.name}, ${destination.country}`}
        className="dest-page-hero-img"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="dest-page-hero-img dest-page-hero-fallback"
      style={{ background: `linear-gradient(135deg, #0a1030 0%, #0d1a40 100%)` }}
      aria-hidden="true"
    />
  );
}

export default function DestinationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const destination = getDestinationById(id);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!destination) {
    return (
      <main id="main-content" className="dest-not-found">
        <div className="dest-not-found-inner glass-card">
          <div className="dest-not-found-icon" aria-hidden="true">🗺️</div>
          <h1 className="dest-not-found-title">Destination Not Found</h1>
          <p>We couldn't find a destination with that ID.</p>
          <Link to="/explore" className="btn btn-primary">
            ← Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: '🌍' },
    { id: 'places', label: `Famous Places (${destination.places.length})`, icon: '🏛️' },
    { id: 'weather', label: 'Weather', icon: '☀️' },
    { id: 'itinerary', label: 'Plan My Trip', icon: '✨' },
  ];

  return (
    <main id="main-content" className="dest-page">
      {/* Hero */}
      <section className="dest-page-hero" aria-label={`${destination.name} hero`}>
        <div className="dest-page-hero-media">
          <HeroImage destination={destination} />
          <div className="dest-page-hero-overlay" aria-hidden="true" />
        </div>

        <div className="dest-page-hero-content container">
          <nav aria-label="Breadcrumb" className="dest-page-breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/explore" className="breadcrumb-link">Explore</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{destination.name}</span>
          </nav>

          <div className="dest-page-title-group">
            <div className="dest-page-meta">
              <span className="badge badge-cyan">{destination.continent}</span>
              <span className="badge badge-gold">{destination.type}</span>
            </div>
            <h1 className="dest-page-title">{destination.name}</h1>
            <p className="dest-page-country">
              <span aria-hidden="true">📍</span> {destination.country}
            </p>
            <p className="dest-page-tagline">{destination.tagline}</p>
          </div>

          <div className="dest-page-quick-facts" role="list" aria-label="Quick facts">
            {[
              { icon: '🗣️', label: 'Language', value: destination.language },
              { icon: '💰', label: 'Currency', value: destination.currency },
              { icon: '🕐', label: 'Timezone', value: destination.timezone },
              { icon: '📅', label: 'Best Time', value: destination.bestTime },
            ].map(fact => (
              <div key={fact.label} className="dest-page-fact" role="listitem">
                <span aria-hidden="true">{fact.icon}</span>
                <div>
                  <span className="dest-page-fact-label">{fact.label}</span>
                  <span className="dest-page-fact-value">{fact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="dest-page-tabs-wrapper" role="navigation" aria-label="Destination sections">
        <div className="container">
          <div className="dest-page-tabs" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                className={`dest-page-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container dest-page-content">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div
            id="tabpanel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="dest-tab-panel animate-fade-in-up"
          >
            <div className="dest-overview-layout">
              {/* Main */}
              <div className="dest-overview-main">
                <div className="dest-overview-about glass-card">
                  <h2 className="dest-overview-section-title">About {destination.name}</h2>
                  <p className="dest-overview-desc">{destination.description}</p>
                  <div className="dest-overview-tags">
                    {destination.tags.map(tag => (
                      <span key={tag} className="badge badge-cyan">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Places preview */}
                <div className="dest-overview-places">
                  <div className="dest-overview-places-header">
                    <h2 className="dest-overview-section-title">Famous Places</h2>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setActiveTab('places')}
                      aria-label="View all famous places"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="dest-overview-places-grid">
                    {destination.places.slice(0, 3).map((place, i) => (
                      <PlaceCard key={place.id} place={place} destinationName={destination.name} index={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="dest-overview-sidebar" aria-label="Destination sidebar">
                <WeatherWidget coords={destination.weather} cityName={destination.name} />

                <div className="dest-overview-info glass-card">
                  <h3 className="dest-sidebar-title">Essential Info</h3>
                  <div className="dest-info-list">
                    {[
                      { label: 'Language', value: destination.language, icon: '🗣️' },
                      { label: 'Currency', value: destination.currency, icon: '💰' },
                      { label: 'Timezone', value: destination.timezone, icon: '🕐' },
                      { label: 'Best Time', value: destination.bestTime, icon: '📅' },
                      { label: 'Continent', value: destination.continent, icon: '🌍' },
                      { label: 'Type', value: destination.type, icon: '🏷️' },
                    ].map(item => (
                      <div key={item.label} className="dest-info-item">
                        <span aria-hidden="true">{item.icon}</span>
                        <div>
                          <dt className="dest-info-label">{item.label}</dt>
                          <dd className="dest-info-value">{item.value}</dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-gold btn-lg dest-plan-btn"
                  onClick={() => setActiveTab('itinerary')}
                  id="plan-trip-cta"
                >
                  ✨ Plan My Trip to {destination.name}
                </button>
              </aside>
            </div>
          </div>
        )}

        {/* PLACES TAB */}
        {activeTab === 'places' && (
          <div
            id="tabpanel-places"
            role="tabpanel"
            aria-labelledby="tab-places"
            className="dest-tab-panel animate-fade-in-up"
          >
            <div className="dest-places-header">
              <div>
                <h2 className="section-title">
                  Famous Places in <span className="gradient-text">{destination.name}</span>
                </h2>
                <p className="section-subtitle">
                  {destination.places.length} iconic locations worth experiencing in {destination.name}.
                </p>
              </div>
            </div>
            <div className="dest-places-grid" role="list">
              {destination.places.map((place, i) => (
                <div key={place.id} role="listitem">
                  <PlaceCard place={place} destinationName={destination.name} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEATHER TAB */}
        {activeTab === 'weather' && (
          <div
            id="tabpanel-weather"
            role="tabpanel"
            aria-labelledby="tab-weather"
            className="dest-tab-panel animate-fade-in-up"
          >
            <div className="dest-weather-layout">
              <div className="dest-weather-main">
                <h2 className="section-title">
                  Weather in <span className="gradient-text">{destination.name}</span>
                </h2>
                <p className="section-subtitle">
                  Live weather conditions for {destination.name}, {destination.country}.
                  You can also check the weather in any other city below.
                </p>
                <WeatherWidget coords={destination.weather} cityName={destination.name} />
              </div>
              <div className="dest-weather-info glass-card">
                <h3 className="dest-sidebar-title">📅 Best Time to Visit</h3>
                <p className="dest-weather-best-time">{destination.bestTime}</p>
                <p className="dest-weather-tip">
                  Plan ahead with our AI assistant — ask about the best season, what to pack, and current weather conditions.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => document.getElementById('chatbot-toggle')?.click()}
                >
                  🤖 Ask the AI Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div
            id="tabpanel-itinerary"
            role="tabpanel"
            aria-labelledby="tab-itinerary"
            className="dest-tab-panel animate-fade-in-up"
          >
            <ItineraryPlanner destination={destination} />
          </div>
        )}

        {/* Back link */}
        <div className="dest-page-back">
          <Link to="/explore" className="btn btn-ghost btn-sm">
            ← Back to All Destinations
          </Link>
        </div>
      </div>

      {/* Floating AI Chat — context-aware */}
      <ChatBot destination={destination} />
    </main>
  );
}
