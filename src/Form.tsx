import React, { FormEvent, useRef, useState, useEffect} from "react";
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
  }
  coord: {
    lon: number;
    lat: number;
  }
  wind: { 
    deg: number
    gust: number
    speed: number
  }
  weather: {
    main: string;
    description: string;
  }[];
}

const Form = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [city, setCity] = useState("Vancouver"); // Default city
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  console.log(city)

  const fetchWeatherData = (city: string) => {
    const apiUrl = Generate_Url() + city;
    console.log(apiUrl)

    fetch(apiUrl)
      .then((response) =>{
         return response.json()}
        )
        .then((cityData) => {
          // checking validity of response
          if (!cityData.main || !cityData.weather) {
            throw new Error("Invalid response received");
          }
          console.log(cityData);
          // Set weather data to state
          setWeatherData({
            main: cityData.main,
            weather: cityData.weather,
            coord: cityData.coord,
            sys: cityData.sys,
            wind: cityData.wind
          });
          setError(""); // Reset error state
        })
        .catch((error) => {
          setError("Error fetching weather data: " + error.message);
          console.error("Error fetching weather data:", error);
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
      document.title = "Weather App";
      fetchWeatherData(city); // Fetch weather data for the initial city
    }); 

  return (
    <div className="layout">
      <div className="sidebar">
        <form onSubmit={(event) => handleSubmit(event)}>
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
              {weatherData  ? `${Math.round(weatherData?.main.temp - 273.15)}°C`: "N/A"} {"+/- 3%"}
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
          <div>
            <h2>Lagos</h2>
            <p>20°C</p>
          </div>
          <div>
            <h2>Gander</h2>
            <p>17°C</p>
          </div>
          <div>
            <h2>Wakajaye</h2>
            <p>14°C</p>
          </div>
          <div>
            <h2>Monatan</h2>
            <p>10°C</p>
          </div>
          <div>
            <h2>Akobo</h2>
            <p>-8°C</p>
          </div>
          <div>
            <h2>Bodija</h2>
            <p>-9°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;