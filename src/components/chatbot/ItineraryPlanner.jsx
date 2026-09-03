import { useState } from 'react';
import { generateItinerary } from '../../services/geminiService';
import ItineraryRenderer from './ItineraryRenderer';
import LoadingSpinner from '../ui/LoadingSpinner';
import './ItineraryPlanner.css';

const STYLES = ['Explorer', 'Relaxed', 'Cultural', 'Adventure', 'Foodie', 'Budget', 'Luxury'];
const INTERESTS = ['History', 'Art', 'Food', 'Nature', 'Nightlife', 'Shopping', 'Architecture', 'Photography', 'Sports', 'Local Culture'];

export default function ItineraryPlanner({ destination }) {
  const [days, setDays] = useState(5);
  const [style, setStyle] = useState('Explorer');
  const [interests, setInterests] = useState(['History', 'Food']);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(true);

  const toggleInterest = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerate = async () => {
    if (interests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateItinerary(destination, days, style, interests);
      setItinerary(result);
      setFormVisible(false);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setFormVisible(true);
    setError(null);
  };

  return (
    <div className="itinerary-planner" id="itinerary-planner">
      <div className="itinerary-header">
        <div>
          <span className="section-label">AI Trip Planner</span>
          <h2 className="section-title">Plan Your <span className="gradient-text">{destination.name}</span> Trip</h2>
          <p className="section-subtitle">
            Tell us how you travel and let our AI design a personalized day-by-day itinerary just for you.
          </p>
        </div>
        {itinerary && (
          <button className="btn btn-ghost btn-sm itinerary-reset" onClick={handleReset}>
            ← Start Over
          </button>
        )}
      </div>

      {formVisible && (
        <div className="itinerary-form glass-card animate-fade-in-up">
          {/* Days */}
          <div className="itinerary-field">
            <label className="itinerary-field-label" htmlFor="itinerary-days">
              Duration
              <span className="itinerary-field-value">{days} days</span>
            </label>
            <input
              id="itinerary-days"
              type="range"
              min="2"
              max="14"
              value={days}
              onChange={e => setDays(parseInt(e.target.value))}
              className="itinerary-range"
              aria-label={`Trip duration: ${days} days`}
            />
            <div className="itinerary-range-labels">
              <span>2 days</span>
              <span>14 days</span>
            </div>
          </div>

          {/* Travel Style */}
          <div className="itinerary-field">
            <label className="itinerary-field-label">Travel Style</label>
            <div className="itinerary-chips" role="group" aria-label="Select travel style">
              {STYLES.map(s => (
                <button
                  key={s}
                  className={`itinerary-chip ${style === s ? 'active' : ''}`}
                  onClick={() => setStyle(s)}
                  aria-pressed={style === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="itinerary-field">
            <label className="itinerary-field-label">
              Interests
              <span className="itinerary-field-note">Select all that apply</span>
            </label>
            <div className="itinerary-chips" role="group" aria-label="Select interests">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  className={`itinerary-chip ${interests.includes(interest) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={interests.includes(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="itinerary-error" role="alert">{error}</p>
          )}

          <button
            className="btn btn-gold btn-lg itinerary-generate-btn"
            onClick={handleGenerate}
            disabled={loading || interests.length === 0}
            id="generate-itinerary-btn"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" /> Generating your itinerary...
              </>
            ) : (
              <>✨ Generate My Itinerary</>
            )}
          </button>
        </div>
      )}

      {loading && !formVisible && (
        <div className="itinerary-generating glass-card">
          <LoadingSpinner size="lg" label="Generating itinerary" />
          <p className="itinerary-generating-text">
            Our AI is crafting your perfect {days}-day {style.toLowerCase()} itinerary for {destination.name}...
          </p>
        </div>
      )}

      {itinerary && !loading && (
        <ItineraryRenderer itinerary={itinerary} destination={destination} />
      )}
    </div>
  );
}
