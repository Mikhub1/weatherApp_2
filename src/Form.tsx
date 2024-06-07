import React, { FormEvent, useRef, useState, useEffect } from "react";
import "./App.css";
import Generate_Url from "./Url";

// Define the structure of the weather data
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    lon: number;
    lat: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

const Form = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [city, setCity] = useState("Oklahoma City"); // Default city
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  const fetchWeatherData = (city: string) => {
    const apiUrl = Generate_Url() + city;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((cityData) => {
        if (!cityData.main || !cityData.weather) {
          throw new Error("Invalid response received");
        }
        setWeatherData({
          main: cityData.main,
          weather: cityData.weather,
        });
        setError(""); // Reset error state
      })
      .catch((error) => {
        setError("Error fetching weather data: " + error.message);
      });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (nameRef.current !== null) {
      const newCity = nameRef.current.value;
      setCity(newCity);
      fetchWeatherData(newCity);
    }
  };

  useEffect(() => {
    fetchWeatherData(city); // Fetch default city weather data on mount
  }, []);

  return (
    <div className="layout">
      <div className="sidebar">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div>
            <input
              ref={nameRef}
              id="city"
              className="form-control"
              placeholder="Enter city"
            />
            <button type="submit">Get Weather</button>
          </div>
          <div id="box">
            {weatherData && (
              <>
                <h1>{Math.round(weatherData.main.temp - 273.15)}°C</h1>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Lon: {weatherData.main.lon}, Lat: {weatherData.main.lat}</p>
              </>
            )}
            {error && <p>{error}</p>}
          </div>
        </form>
      </div>
      <div className="main-content">
        <h1>Weather Forecast</h1>
        <div className="weather-info">
          {weatherData?.weather[0].description}
        </div>
        <div className="weather-forecast">
          <div>
            <h2>Washington D.C</h2>
            <p>20°C</p>
          </div>
          <div>
            <h2>Oklahoma City</h2>
            <p>17°C</p>
          </div>
          <div>
            <h2>Philadelphia</h2>
            <p>14°C</p>
          </div>
          <div>
            <h2>New York City</h2>
            <p>10°C</p>
          </div>
          <div>
            <h2>South Dakota</h2>
            <p>-8°C</p>
          </div>
          <div>
            <h2>North Dakota</h2>
            <p>-9°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;