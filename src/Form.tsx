import React, { FormEvent, useRef, useState } from "react";
import "./App.css";
import Generate_Url from "./Url";

// Modify the code to return to a default city details that can be overwritten
// when a new city input is given
//

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
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");
  //const [apiUrl, setApiUrl] = useState("");

  console.log(city);
  const fetchWeatherData = (city: string) => {
    // Call Generate_Url function to get the complete URL
    const apiUrl = Generate_Url() + city;
    console.log(apiUrl);

    // Make a GET request using the Fetch API
    fetch(apiUrl)
      .then((response) => {
        //if (!response.ok) {
        // Throw an error if response is not ok
        //we handle the response by checking if it's okay using the response.ok property. If the response is okay,
        //we convert it to JSON and process the user data.
        //throw new Error("Network response was not ok");
        //}
        return response.json();
      })
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

  return (
    <div className="layout">
      <div className="sidebar">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div>
            <input
              ref={nameRef}
              id="city"
              className="form-control"
              placeholder={""}
              />
            <button type="submit">Info</button>
          </div>
          <div id="box">
            {weatherData?.main.temp}K<p></p>
            <p></p>
            {weatherData?.main.lon}
            {weatherData?.main.lat}
            {error && <p>{error}</p>}
          </div>
        </form>
       </div>
      <div>
        <h1>Homepage</h1>
        {weatherData?.weather[0].description}
      </div>
    </div>
  );
};

export default Form;
