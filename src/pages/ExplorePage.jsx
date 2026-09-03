import DestinationGrid from '../components/destinations/DestinationGrid';
import './ExplorePage.css';

export default function ExplorePage() {
  return (
    <main id="main-content" className="explore-page">
      {/* Page Hero */}
      <div className="explore-hero">
        <div className="explore-hero-bg" aria-hidden="true" />
        <div className="container explore-hero-content">
          <span className="section-label">Destinations</span>
          <h1 className="explore-title">
            Explore the <span className="gradient-text">World</span>
          </h1>
          <p className="explore-subtitle">
            Browse 20+ handpicked destinations across 6 continents. Search by name, filter by region
            or type, and find your next great adventure.
          </p>
          <div className="explore-stats" aria-label="Statistics">
            {[
              { value: '20+', label: 'Destinations' },
              { value: '6', label: 'Continents' },
              { value: '120+', label: 'Famous Places' },
              { value: 'Live', label: 'Weather Data' },
            ].map(s => (
              <div key={s.label} className="explore-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container explore-content">
        <DestinationGrid />
      </div>
    </main>
  );
}
