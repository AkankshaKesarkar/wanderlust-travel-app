import './ItineraryRenderer.css';

const TIME_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌙' };
const TIME_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

export default function ItineraryRenderer({ itinerary, destination }) {
  const handlePrint = () => window.print();

  return (
    <div className="itinerary-renderer animate-fade-in-up">
      {/* Overview card */}
      <div className="itinerary-overview glass-card">
        <div className="itinerary-overview-header">
          <div>
            <h3 className="itinerary-overview-title">{itinerary.title}</h3>
            <p className="itinerary-overview-meta">
              <span className="badge badge-cyan">{itinerary.days} Days</span>
              <span className="badge badge-gold">{itinerary.style}</span>
              <span className="badge badge-violet">{itinerary.destination}</span>
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm itinerary-print-btn"
            onClick={handlePrint}
            aria-label="Print itinerary"
          >
            🖨️ Print
          </button>
        </div>
        <p className="itinerary-overview-text">{itinerary.overview}</p>

        {itinerary.tips && itinerary.tips.length > 0 && (
          <div className="itinerary-tips">
            <h4 className="itinerary-tips-title">📌 Pro Tips</h4>
            <ul className="itinerary-tips-list">
              {itinerary.tips.map((tip, i) => (
                <li key={i} className="itinerary-tip">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Day-by-day timeline */}
      <div className="itinerary-timeline" role="list">
        {itinerary.days_plan.map((day, idx) => (
          <article
            key={day.day}
            className="itinerary-day glass-card animate-fade-in-up"
            style={{ animationDelay: `${idx * 100}ms` }}
            role="listitem"
            aria-label={`Day ${day.day}: ${day.theme}`}
          >
            {/* Day header */}
            <div className="itinerary-day-header">
              <div className="itinerary-day-number" aria-hidden="true">
                <span>{day.day}</span>
              </div>
              <div className="itinerary-day-info">
                <p className="itinerary-day-label">Day {day.day}</p>
                <h3 className="itinerary-day-theme">{day.theme}</h3>
              </div>
            </div>

            {/* Time slots */}
            <div className="itinerary-slots">
              {['morning', 'afternoon', 'evening'].map(period => {
                const slot = day[period];
                if (!slot) return null;
                return (
                  <div key={period} className={`itinerary-slot itinerary-slot-${period}`}>
                    <div className="itinerary-slot-time">
                      <span className="itinerary-slot-icon" aria-hidden="true">{TIME_ICONS[period]}</span>
                      <span className="itinerary-slot-label">{TIME_LABELS[period]}</span>
                      {slot.duration && (
                        <span className="itinerary-slot-duration">{slot.duration}</span>
                      )}
                    </div>
                    <div className="itinerary-slot-content">
                      <h4 className="itinerary-slot-activity">{slot.activity}</h4>
                      <p className="itinerary-slot-desc">{slot.description}</p>
                      {slot.tips && (
                        <p className="itinerary-slot-tip">
                          <span aria-hidden="true">💡</span> {slot.tips}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dining */}
            {day.dining && (
              <div className="itinerary-dining">
                <h4 className="itinerary-dining-title">
                  <span aria-hidden="true">🍽️</span> Where to Eat
                </h4>
                <div className="itinerary-dining-grid">
                  {[
                    { label: 'Breakfast', value: day.dining.breakfast, icon: '☕' },
                    { label: 'Lunch', value: day.dining.lunch, icon: '🥗' },
                    { label: 'Dinner', value: day.dining.dinner, icon: '🍷' },
                  ].map(meal => (
                    <div key={meal.label} className="itinerary-meal">
                      <span className="itinerary-meal-icon" aria-hidden="true">{meal.icon}</span>
                      <div>
                        <span className="itinerary-meal-label">{meal.label}</span>
                        <p className="itinerary-meal-value">{meal.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
