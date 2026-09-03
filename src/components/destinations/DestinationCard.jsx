import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSingleImage } from '../../hooks/useImages';
import './DestinationCard.css';

const TYPE_BADGE_CLASS = {
  City: 'badge-cyan',
  Beach: 'badge-gold',
  Mountain: 'badge-violet',
  Cultural: 'badge-rose',
  Adventure: 'badge-emerald',
  Nature: 'badge-emerald',
  'Middle East': 'badge-gold',
};

export default function DestinationCard({ destination, index = 0 }) {
  const { id, name, country, continent, type, tagline, tags } = destination;
  const { image, loading } = useSingleImage(`${name} ${country} travel landscape`);
  const [imgError, setImgError] = useState(false);

  const badgeClass = TYPE_BADGE_CLASS[type] || 'badge-cyan';
  const animDelay = (index % 12) * 50;

  return (
    <article
      className="dest-card glass-card glass-card-hover animate-fade-in-up"
      style={{ animationDelay: `${animDelay}ms` }}
      aria-label={`${name}, ${country}`}
    >
      <Link to={`/destination/${id}`} className="dest-card-link" tabIndex={-1} aria-hidden="true">
        <div className="dest-card-image-wrapper">
          {loading ? (
            <div className="dest-card-image skeleton" />
          ) : image && !imgError ? (
            <img
              src={image.url}
              alt={`${name}, ${country}`}
              className="dest-card-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="dest-card-image dest-card-fallback">
              <span className="dest-card-fallback-text">{name}</span>
            </div>
          )}
          <div className="dest-card-overlay" />
          <div className="dest-card-type-badge">
            <span className={`badge ${badgeClass}`}>{type}</span>
          </div>
        </div>
      </Link>

      <div className="dest-card-body">
        <div className="dest-card-meta">
          <span className="dest-card-continent" aria-label={`Continent: ${continent}`}>
            {continent}
          </span>
        </div>

        <h2 className="dest-card-title">
          <Link to={`/destination/${id}`} className="dest-card-title-link">
            {name}
          </Link>
        </h2>

        <p className="dest-card-country">{country}</p>
        <p className="dest-card-tagline">{tagline}</p>

        <div className="dest-card-tags" aria-label="Tags">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="dest-card-tag">{tag}</span>
          ))}
        </div>

        <Link
          to={`/destination/${id}`}
          className="dest-card-cta btn btn-ghost btn-sm"
          aria-label={`Explore ${name}`}
        >
          Explore →
        </Link>
      </div>
    </article>
  );
}
