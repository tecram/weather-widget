# Weather Widget

Simple weather widget built with React and the Open Meteo API. It uses CDN versions of React so no build step is required for the JavaScript. Styles are written in SCSS and the compiled CSS is included.

## Usage

Open `index.html` in a browser with internet access. The widget tries to detect your location using the Geolocation API and fetches current weather information. You can toggle dark/light theme and Celsius/Fahrenheit units. Settings are stored in `localStorage`.

## Files

- `index.html` – main HTML page loading React from CDN
- `styles.scss` – SCSS source for the widget styles
- `styles.css` – compiled CSS from the SCSS
- `weather-widget.js` – React component implementation

To update the CSS after modifying `styles.scss`, compile it using a SCSS compiler such as:

```bash
sass styles.scss styles.css
```
