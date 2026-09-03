import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinations, CONTINENTS, TYPES } from '../../data/destinations';
import DestinationCard from './DestinationCard';
import './DestinationGrid.css';

export default function DestinationGrid({ compact = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [continent, setContinent] = useState(searchParams.get('continent') || 'All');
  const [type, setType] = useState('All');

  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('continent');
    if (s) setSearch(s);
    if (c) setContinent(c);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let results = destinations;

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.continent.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.tagline.toLowerCase().includes(q)
      );
    }

    if (continent !== 'All') {
      results = results.filter(d => d.continent === continent);
    }

    if (type !== 'All') {
      results = results.filter(d => d.type === type);
    }

    return results;
  }, [search, continent, type]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setSearchParams(params => {
      if (val) params.set('search', val);
      else params.delete('search');
      return params;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setContinent('All');
    setType('All');
    setSearchParams({});
  };

  const hasFilters = search || continent !== 'All' || type !== 'All';

  return (
    <div className="dest-grid-wrapper">
      {/* Search + Filters */}
      {!compact && (
        <div className="dest-filters glass-card" role="search" aria-label="Filter destinations">
          <div className="dest-search-bar">
            <span className="dest-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search destinations..."
              className="dest-search-input"
              aria-label="Search destinations"
              id="explore-search-input"
            />
            {search && (
              <button
                className="dest-search-clear"
                onClick={() => { setSearch(''); setSearchParams(p => { p.delete('search'); return p; }); }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="dest-filter-groups">
            <div className="dest-filter-group" role="group" aria-label="Filter by continent">
              <span className="dest-filter-label">Continent</span>
              <div className="dest-filter-chips">
                {CONTINENTS.map(c => (
                  <button
                    key={c}
                    className={`dest-filter-chip ${continent === c ? 'active' : ''}`}
                    onClick={() => {
                      setContinent(c);
                      setSearchParams(params => {
                        if (c !== 'All') params.set('continent', c);
                        else params.delete('continent');
                        return params;
                      });
                    }}
                    aria-pressed={continent === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="dest-filter-group" role="group" aria-label="Filter by type">
              <span className="dest-filter-label">Type</span>
              <div className="dest-filter-chips">
                {TYPES.map(t => (
                  <button
                    key={t}
                    className={`dest-filter-chip ${type === t ? 'active' : ''}`}
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasFilters && (
            <button className="dest-clear-btn btn btn-ghost btn-sm" onClick={clearFilters}>
              Clear All Filters ✕
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="dest-results-meta" aria-live="polite">
        <span className="dest-results-count">
          {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
          {hasFilters ? ' found' : ''}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className={`dest-grid ${compact ? 'dest-grid-compact' : ''}`} role="list">
          {(compact ? filtered.slice(0, 6) : filtered).map((dest, i) => (
            <div key={dest.id} role="listitem">
              <DestinationCard destination={dest} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="dest-empty" role="status" aria-live="polite">
          <div className="dest-empty-icon" aria-hidden="true">🗺️</div>
          <h3 className="dest-empty-title">No destinations found</h3>
          <p className="dest-empty-text">
            Try a different search term or adjust your filters.
          </p>
          <button className="btn btn-outline btn-sm" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
