const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherByCoords(lat, lon) {
  if (!API_KEY || API_KEY === 'your_openweather_api_key_here') {
    return getMockWeather(lat, lon);
  }
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Weather API error');
    const data = await response.json();
    return transformWeather(data);
  } catch (err) {
    console.error('Weather fetch failed:', err);
    return getMockWeather(lat, lon);
  }
}

export async function fetchWeatherByCity(city) {
  if (!API_KEY || API_KEY === 'your_openweather_api_key_here') {
    return getMockWeather(null, null, city);
  }
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Weather API error');
    const data = await response.json();
    return transformWeather(data);
  } catch (err) {
    console.error('Weather fetch failed:', err);
    return getMockWeather(null, null, city);
  }
}

function transformWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
    windDir: data.wind.deg,
    condition: data.weather[0].description,
    conditionCode: data.weather[0].id,
    icon: data.weather[0].icon,
    visibility: Math.round((data.visibility || 10000) / 1000),
    pressure: data.main.pressure,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function getMockWeather(lat, lon, city = 'Location') {
  const temps = { hot: 32, warm: 24, cool: 16, cold: 4 };
  const conditions = ['Clear skies', 'Partly cloudy', 'Overcast', 'Light breeze', 'Sunny intervals'];
  const temp = temps.warm + Math.floor(Math.random() * 16) - 8;
  return {
    city: city,
    country: '--',
    temp,
    feelsLike: temp - 2,
    tempMin: temp - 4,
    tempMax: temp + 4,
    humidity: 55 + Math.floor(Math.random() * 30),
    windSpeed: 10 + Math.floor(Math.random() * 20),
    windDir: 180,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    conditionCode: 800,
    icon: '01d',
    visibility: 10,
    pressure: 1013,
    sunrise: '06:15',
    sunset: '20:30',
    isMock: true,
  };
}

export function getWeatherIcon(code) {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return '☀️';
  if (code === 801) return '🌤️';
  if (code === 802) return '⛅';
  if (code >= 803) return '☁️';
  return '🌡️';
}

export function getWindDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}
