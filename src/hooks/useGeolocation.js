import { useState, useEffect } from 'react';
import { reverseGeocode } from '../services/geocodingService';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setPermission('denied');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const geo = await reverseGeocode(latitude, longitude);
        setLocation({ ...geo, lat: latitude, lon: longitude });
        setPermission('granted');
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermission('denied');
          setError('Location permission was denied. You can still search for any city below.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setPermission('denied');
          setError('Location information is unavailable.');
        } else {
          setPermission('denied');
          setError('Unable to retrieve your location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return { location, loading, error, permission, requestLocation };
}
