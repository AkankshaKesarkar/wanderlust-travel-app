import { useState } from 'react';
import { useSingleImage } from '../../hooks/useImages';
import './PlaceCard.css';

const CATEGORY_COLORS = {
  Temple: 'badge-violet',
  Shrine: 'badge-violet',
  Landmark: 'badge-cyan',
  Nature: 'badge-emerald',
  Museum: 'badge-rose',
  District: 'badge-gold',
  Experience: 'badge-gold',
  Adventure: 'badge-rose',
  Beach: 'badge-cyan',
  Food: 'badge-gold',
  History: 'badge-violet',
  Art: 'badge-rose',
  Village: 'badge-emerald',
  Palace: 'badge-gold',
  Ruins: 'badge-violet',
  Heritage: 'badge-violet',
  Mountain: 'badge-emerald',
  Garden: 'badge-emerald',
  Town: 'badge-cyan',
};

export default function PlaceCard({ place, destinationName, index = 0 }) {
  const { name, category, description } = place;
  const imageQuery = `${name} ${destinationName} ${category} travel`;
  const { image, loading } = useSingleImage(imageQuery);
  const [imgError, setImgError] = useState(false);
  const badgeClass = CATEGORY_COLORS[category] || 'badge-cyan';
  const animDelay = (index % 6) * 80;

  return (
    <article
      className="place-card glass-card glass-card-hover animate-fade-in-up"
      style={{ animationDelay: `${animDelay}ms` }}
      aria-label={name}
    >
      <div className="place-card-image-wrapper">
        {loading ? (
          <div className="place-card-image skeleton" />
        ) : image && !imgError ? (
          <img
            src={image.url}
            alt={`${name} in ${destinationName}`}
            className="place-card-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="place-card-image place-card-fallback">
            <span aria-hidden="true">🏛️</span>
          </div>
        )}
        <div className="place-card-overlay" aria-hidden="true" />
        <span className={`badge ${badgeClass} place-card-badge`} aria-label={`Category: ${category}`}>
          {category}
        </span>
      </div>

      <div className="place-card-body">
        <h3 className="place-card-title">{name}</h3>
        <p className="place-card-desc">{description}</p>
      </div>
    </article>
  );
}
