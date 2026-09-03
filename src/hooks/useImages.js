import { useState, useEffect } from 'react';
import { fetchImages, fetchSingleImage } from '../services/pexelsService';

export function useImages(query, count = 6) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    fetchImages(query, count)
      .then(imgs => {
        setImages(imgs);
        setLoading(false);
      })
      .catch(() => {
        setError('Images unavailable');
        setLoading(false);
      });
  }, [query, count]);

  return { images, loading, error };
}

export function useSingleImage(query) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);

    fetchSingleImage(query)
      .then(img => {
        setImage(img);
        setLoading(false);
      })
      .catch(() => {
        setImage(null);
        setLoading(false);
      });
  }, [query]);

  return { image, loading };
}
