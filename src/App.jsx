import { useState } from "react";
import searchIcon from "./assets/search.svg"
import LocationCard from "./components/LocationCard"

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
const weatherIcons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    56: "🌧️",
    57: "🌧️",
    61: "🌦️",
    63: "🌧️",
    65: "🌧️",
    66: "🌧️",
    67: "🌧️",
    71: "🌨️",
    73: "🌨️",
    75: "❄️",
    77: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    85: "🌨️",
    86: "❄️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };

function App() {
  const 
  [searchCity, setSearchCity] = useState(""),
  [city, setCity] = useState(""),
  [locations, setLocations] = useState([]),
  [weather, setWeather] = useState(null),
  [loading, setLoading] = useState(""),
  [error, setError] = useState("Search for a city to see the weather.");

  async function getLocation(cityName) {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search?` +
      `name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;
    // name={cityName}, count=1 language = en format = json;

    const response = await fetch(url); // Get json format 👆;

    if (!response.ok) {
      setError("Could not get location data.");
      throw new Error("Could not get location data.");
    };

    const data = await response.json(); // .json() read the json format

    return data.results ?? [];
  }

  async function getWeather(latitude, longitude) {
    const url =
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
      `weather_code,wind_speed_10m,precipitation_probability` +
      `&timezone=auto`;
    
    const response = await fetch(url);

    if (!response.ok) {
      setError("Could not connect to the weather service.");
      throw new Error("Could not get weather data.");
    }

    const data = await response.json();

    return data.current;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (searchCity.trim() === "") {
      setError("Enter a city name.");
      return;
    }

    try {
      setLoading("Searching...");
      setError("")

      const locationData = await getLocation(searchCity);
    
      if (locationData.length === 0) {
        setError("City not found.");
        return;
      }
      setLocations(locationData);
      setSearchCity("");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading("");
    }
  }

  async function handleLocationSelect(location) {
    try {
      setLoading("Loading weather...");
      setError("");

      const weatherData = await getWeather(
        location.latitude, 
        location.longitude
      );

      setCity(location.name);
      setWeather(weatherData);
      setLocations([]);

    } catch (error) {
      setError("Could not connect to the weather service.")
      console.error(error);
    } finally {
      setLoading("");
    }
  }

  return (
    <>
      <main className="weather-app">
        <header>
          <h1>Weather App</h1>
        </header>

        <div className="form-container">
          <form className="search-form" onSubmit={handleSubmit}>
            <label htmlFor="city">
              <img className="i-search" src={searchIcon} alt="" />
            </label>
            <input
              id="city"
              type="text"
              placeholder="Search a city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button className="input-del-btn">x</button>
            <button className="search-btn">Search</button>
          </form>
        </div>

        {loading ? <p className="no-result-text">{loading}</p> : null}

        {locations.map((location) => (
          <LocationCard key={location.id} location={location} onSelect={handleLocationSelect} />
        ))}

        {weather ? (
          <section className="weather-card">
            <p className="weather-icon">{weatherIcons[weather.weather_code]}</p>

            <div>
              <p className="city-name">{city}</p>
              <p className="temperature">{Math.round(weather.temperature_2m)}°C</p>
              <p className="temperature">Feels like {Math.round(weather.apparent_temperature)}°C</p>
            </div>

            <div className="card-detail">
              <p>{weatherDescriptions[weather.weather_code] ?? "Unknown weather"}</p>
              <p>Precipitation: {weather.precipitation_probability}%</p>
              <p>Humidity: {weather.relative_humidity_2m}%</p>
              <p>Wind: {weather.wind_speed_10m} km/h</p>
            </div>
          </section>
        ) : null}

        {locations.length !== 0 || weather || loading ? null : 
          <p className="no-result-text">{error}</p>
        }
      </main>
    </>
  );
}

export default App;
