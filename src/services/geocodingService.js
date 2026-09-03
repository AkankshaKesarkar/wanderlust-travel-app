const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export async function geocodeCity(query) {
  try {
    const res = await fetch(
      `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    return data.map(r => ({
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      displayName: r.display_name,
      city: r.address?.city || r.address?.town || r.address?.village || r.name,
      country: r.address?.country,
      countryCode: r.address?.country_code?.toUpperCase(),
    }));
  } catch (err) {
    console.error('Geocoding error:', err);
    return [];
  }
}

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    return {
      lat,
      lon,
      city: data.address?.city || data.address?.town || data.address?.village || 'Your Location',
      country: data.address?.country,
      displayName: data.display_name,
    };
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return { lat, lon, city: 'Your Location', country: '' };
  }
}
