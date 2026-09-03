import { useState, useEffect } from 'react';
import { fetchWeatherByCoords, fetchWeatherByCity } from '../services/weatherService';

export function useWeather(coords = null, city = null) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords && !city) return;

    setLoading(true);
    setError(null);

    const fetch = coords
      ? fetchWeatherByCoords(coords.lat, coords.lon)
      : fetchWeatherByCity(city);

    fetch
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Weather data unavailable');
        setLoading(false);
      });
  }, [coords?.lat, coords?.lon, city]);

  return { weather, loading, error };
}
