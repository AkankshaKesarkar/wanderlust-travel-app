const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

const cache = new Map();

export async function fetchImages(query, perPage = 6) {
  const cacheKey = `${query}-${perPage}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (!API_KEY || API_KEY === 'your_pexels_api_key_here') {
    return getFallbackImages(query, perPage);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      { headers: { Authorization: API_KEY } }
    );
    if (!response.ok) throw new Error('Pexels API error');
    const data = await response.json();
    const photos = data.photos.map(p => ({
      id: p.id,
      url: p.src.large2x,
      thumb: p.src.medium,
      small: p.src.small,
      alt: p.alt || query,
      photographer: p.photographer,
      photographerUrl: p.photographer_url,
    }));
    cache.set(cacheKey, photos);
    return photos;
  } catch (err) {
    console.error('Pexels fetch failed:', err);
    return getFallbackImages(query, perPage);
  }
}

export async function fetchSingleImage(query) {
  const results = await fetchImages(query, 1);
  return results[0] || null;
}

function getFallbackImages(query, count) {
  const encodedQuery = encodeURIComponent(query);
  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-${i}`,
    url: `https://source.unsplash.com/1600x900/?${encodedQuery}&sig=${i}`,
    thumb: `https://source.unsplash.com/800x600/?${encodedQuery}&sig=${i}`,
    small: `https://source.unsplash.com/400x300/?${encodedQuery}&sig=${i}`,
    alt: query,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  }));
}
