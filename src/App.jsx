import { useState } from "react";

const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

function App() {
  const 
  [searchCity, setSearchCity] = useState(""),
  [city, setCity] = useState(""),
  [weather, setWeather] = useState(null);

  async function getLocation(cityName) {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search?` +
      `name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    // name={cityName}, count=1 language = en format = json;

    const response = await fetch(url); // Get json format 👆;

    if (!response.ok) throw new Error("Could not get location data.");

    const data = await response.json(); // .json read the json format

    return data.results?.[0];
  }

  async function getWeather(latitude, longitude) {
    const url =
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
      `weather_code,wind_speed_10m,visibility` +
      `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Counld not get weather data.");

    const data = await response.json();

    return data.current;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSearchCity("");

    try {
      const location = await getLocation(searchCity);

      if (!location) {
        console.log("City not found");
        return;
      }

      const weather = await getWeather(location.latitude, location.longitude);
      console.log(weather);
      setCity(location.name);
      setWeather(weather);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="weather-app">
        <header>
          <h1>Weather App</h1>
        </header>

        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="Search a city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </form>

        {weather ? (
          <section className="weather-card">
            <div>
              <p className="city-name">{city ? city : "Today"}</p>
              <p className="temperature">{weather.apparent_temperature}°C</p>
            </div>

            <div className="card-detail">
              <p><strong>{weatherDescriptions[weather.weather_code] ?? "Unknown weather"}</strong></p>
              <p><strong>Humidity:</strong> {weather.relative_humidity_2m}%</p>
              <p><strong>Wind: </strong>{weather.wind_speed_10m} km/h</p>
              <p><strong>Visibility: </strong>{weather.visibility / 1000} km</p>
            </div>
          </section>
        ) : <p className="no-result-text">Search for a city to see the weather.</p>}
        
      </main>
    </>
  );
}

export default App;
