import React, { FormEvent, useRef, useState, useEffect } from "react";
import "./App.css";
import Generate_Url from "./Url";

// Define the structure of the weather data
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lon: number;
    lat: number;
  };
  wind: {
    deg: number;
    gust: number;
    speed: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

const Form = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [city, setCity] = useState(""); // Default city
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Weather data for the selected city
  const [cityWeatherData, setCityWeatherData] = useState<Record<string, WeatherData | null>>({}); // Weather data for multiple cities
  const [error, setError] = useState<string>(""); // Error message state
  const cities = ["Lagos", "Gander", "Florida", "Montana", "Edmonton", "Calgary"];
  console.log(city)
  // Function to fetch weather data for a specific city
  const fetchWeatherData = async (city: string) => {
    const apiUrl = Generate_Url() + city; // Generate API URL for the given city
    console.log(city);
    console.log(apiUrl);

    try {
      const response = await fetch(apiUrl); // Fetch data from API
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      // Pauses execution of an async function until a promise settles, then resumes and returns the result.
      const cityData = await response.json(); // Parse JSON response

      // Check if response is valid
      if (!cityData.main || !cityData.weather) {
        throw new Error("Invalid response received");
      }

      // Update city-specific weather data in state
      setCityWeatherData((tempData) => ({...tempData,[city]: 
        {
          main: cityData.main,
          weather: cityData.weather,
          coord: cityData.coord,
          sys: cityData.sys,
          wind: cityData.wind,
        },
      }));

      setWeatherData({
        main: cityData.main,
        weather: cityData.weather,
        coord: cityData.coord,
        sys: cityData.sys,
        wind: cityData.wind,
      });
  
      setError(""); // Reset error state
    } 
    catch (error) {
      setError("Error fetching weather data: " + error); // Update error message state
      console.error("Error fetching weather data:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    // Check if nameRef.current is not null and get the value
    if (nameRef.current) {
      const newCity = nameRef.current.value

      // Clear error state when submitting new valid city
      setError("");

      // Update selected city state
      setCity(newCity);

      // Fetch weather data for the entered city
      fetchWeatherData(newCity);
    }
  };

  useEffect(() => {
    document.title = "Weather App"; // Update document title
    fetchWeatherData("Ibadan"); // Fetch weather data for the initial city ("Ibadan")

    // Fetch weather data for additional cities
    cities.forEach((city) => {
      fetchWeatherData(city);
    });
  }, []); // Run once when the component mounts

  return (
    <div className="layout">
      <div className="sidebar">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              ref={nameRef}
              id="city"
              className="form-control"
              placeholder="Ibadan"
            />
            <button type="submit">Get Weather</button>
          </div>
          <div id="box">
            <h2>
              {weatherData ? `${Math.round(weatherData.main.temp - 273.15)}°C` : "N/A"} {"+/- 3%"}
            </h2>
            <p>Humidity: {weatherData?.main.humidity}%</p>
            <p>Lon: {weatherData?.coord.lon}, Lat: {weatherData?.coord.lat}</p>
            {error && <p>{error}</p>}
          </div>
          <div id="box">
            <h2>Lon: {weatherData?.coord.lon}, Lat: {weatherData?.coord.lat}</h2>
            <p>Con: {weatherData?.sys.country}, sun: {weatherData?.sys.sunrise}</p>
            {error && <p>{error}</p>}
          </div>
          <div id="box">
            <p>Wind: {weatherData?.wind.deg}, speed: {weatherData?.wind.speed}{"km"}</p>
            {error && <p>{error}</p>}
          </div>
        </form>
      </div>

      <div className="main-content">
        <h1>Weather Forecast</h1>
        <div className="weather-info">
          {weatherData?.weather[0].description}
        </div>
        <div className="weather-details">
          {cities.map((city) => (
            <div key={city}>
              <h2>{city}</h2>
              <p>
                {cityWeatherData[city]? `${Math.round(cityWeatherData[city]!.main.temp - 273.15)}°C`: "NA"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Form;