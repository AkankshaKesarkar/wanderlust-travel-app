const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

const cache = new Map();

// Deterministic seed-based beautiful photos — no API key needed
function getPicsumUrl(query, width, height, index = 0) {
  const seed = encodeURIComponent(`${query}-${index}`);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

function getFallbackImages(query, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-${query}-${i}`,
    url: getPicsumUrl(query, 1200, 800, i),
    thumb: getPicsumUrl(query, 600, 400, i),
    small: getPicsumUrl(query, 400, 300, i),
    alt: query,
    photographer: 'Picsum Photos',
    photographerUrl: 'https://picsum.photos',
  }));
}

export async function fetchImages(query, perPage = 6) {
  const cacheKey = `${query}-${perPage}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (!API_KEY || API_KEY === 'your_pexels_api_key_here') {
    const fallback = getFallbackImages(query, perPage);
    cache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      { headers: { Authorization: API_KEY } }
    );
    if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
    const data = await response.json();
    if (!data.photos || data.photos.length === 0) {
      throw new Error('No photos found');
    }
    const photos = data.photos.map(p => ({
      id: p.id,
      url: p.src.large2x || p.src.large,
      thumb: p.src.medium,
      small: p.src.small,
      alt: p.alt || query,
      photographer: p.photographer,
      photographerUrl: p.photographer_url,
    }));
    cache.set(cacheKey, photos);
    return photos;
  } catch (err) {
    console.warn('Pexels fetch failed, using fallback:', err.message);
    const fallback = getFallbackImages(query, perPage);
    cache.set(cacheKey, fallback);
    return fallback;
  }
}

export async function fetchSingleImage(query) {
  const results = await fetchImages(query, 1);
  return results[0] || null;
}
