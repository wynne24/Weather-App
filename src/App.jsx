import { useState } from "react";
import searchIcon from "./assets/search.svg"

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
  [searching, setSearching] = useState(false),
  [loadingWeather, setLoadingWeather] = useState(false);

  async function getLocation(cityName) {
    const url =
      `https://geocoding-api.open-meteo.com/v1/search?` +
      `name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`;
    // name={cityName}, count=1 language = en format = json;
    
    setSearching(true);
    const response = await fetch(url); // Get json format 👆;

    if (!response.ok) {throw new Error("Could not get location data.")
    } else setSearching(false);

    const data = await response.json(); // .json() read the json format
    console.log(data.results[0]);
    return data.results ?? [];
  }

  async function getWeather(latitude, longitude) {
    const url =
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
      `weather_code,wind_speed_10m,visibility` +
      `&timezone=auto`;
    setLoadingWeather(true);
    const response = await fetch(url);

    if (!response.ok) {throw new Error("Counld not get weather data.") 
    } else setLoadingWeather(false);

    const data = await response.json();
    
    return data.current;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const locationData = await getLocation(searchCity);
    
    if (locationData.length === 0) {
      console.log("City not found");
      return;
    }
    setLocations(locationData);
    setSearchCity("");

    try {
      const location = locationData;

      if (!location) {
        console.log("City not found");
        return;
      }

      setCity(location.name);
      
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLocationSelect(location) {
    const weatherData = await getWeather(location.latitude, location.longitude);

    setCity(location.name);
    setWeather(weatherData);
    setLocations([]);
  }

  return (
    <>
      <main className="weather-app">
        <header>
          <h1>Weather App</h1>
        </header>

        <div className="form-conatiner">
          <form className="search-form" onSubmit={handleSubmit}>
            <label htmlFor="city">
              <img className="i-search" src={searchIcon} />
            </label>
            <input
              id="city"
              type="text"
              placeholder="Search a city"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </form>
        </div>

        {searching ? (<p className="loading">Searching...</p>) : null}
        {loadingWeather ? (<p className="loading">Loading weather...</p>) : null}

        {locations.map((location) => (
          <button
            className="location-card"
            key={location.id}
            onClick={() => handleLocationSelect(location)}
          >
            <p>
              {location.name}, {location.admin1} {location.country}
            </p>
            <p>{location.latitude}, {location.longitude}</p>

          </button>
        ))}

        {weather ? (
          <section className="weather-card">
            <p className="weather-icon">{weatherIcons[weather.weather_code]}</p>

            <div>
              <p className="city-name">{city ? city : "Today"}</p>
              <p className="temperature">{Math.round(weather.apparent_temperature)}°C</p>
            </div>

            <div className="card-detail">
              <p>{weatherDescriptions[weather.weather_code] ?? "Unknown weather"}</p>
              <p>Humidity: {weather.relative_humidity_2m}%</p>
              <p>Wind: {weather.wind_speed_10m} km/h</p>
              <p>Visibility: {weather.visibility / 1000} km</p>
            </div>
          </section>
        ) : ''}
        {locations.length !== 0 || weather || searching ? null : 
          <p className="no-result-text">Search for a city to see the weather.</p>
        }
      </main>
    </>
  );
}

export default App;
