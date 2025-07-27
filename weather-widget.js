const { useState, useEffect } = React;

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'metric');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('unit');
    if (stored) setUnit(stored);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) setTheme(storedTheme);
    fetchWeather();
  }, []);

  function fetchWeather(lat, lon) {
    setLoading(true);
    setError(null);
    const url = lat && lon
      ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      : null;

    if (!url) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        }, () => {
          setError('Location permission denied');
          setLoading(false);
        });
      } else {
        setError('Geolocation not supported');
        setLoading(false);
      }
      return;
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load weather');
        setLoading(false);
      });
  }

  function toggleUnit() {
    const next = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(next);
    localStorage.setItem('unit', next);
  }

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  }

  const temperature = weather?.current_weather?.temperature;
  const windspeed = weather?.current_weather?.windspeed;
  const icon = weather?.current_weather?.weathercode;
  const date = new Date(weather?.current_weather?.time || Date.now());

  return (
    React.createElement('div', { className: `weather-widget ${theme}` },
      React.createElement('div', { className: 'widget-header' },
        React.createElement('h3', null, 'Weather'),
        React.createElement('div', null,
          React.createElement('button', { onClick: toggleTheme, 'aria-label': 'Toggle theme' }, theme === 'light' ? '🌞' : '🌜'),
          React.createElement('button', { onClick: toggleUnit, 'aria-label': 'Toggle units' }, unit === 'metric' ? '°C' : '°F')
        )
      ),
      loading ? React.createElement('p', null, 'Loading...') :
        error ? React.createElement('p', null, error) :
          React.createElement('div', null,
            React.createElement('div', { className: 'temp' }, `${temperature ?? '--'} ${unit === 'metric' ? '°C' : '°F'}`),
            React.createElement('div', { className: 'details' },
              React.createElement('div', null, `Wind: ${windspeed ?? '--'} ${unit === 'metric' ? 'km/h' : 'mph'}`),
              React.createElement('div', null, `Date: ${date.toLocaleString()}`)
            )
          )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(WeatherWidget));

