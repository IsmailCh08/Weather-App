import './index.css';
import { useState } from 'react';
import { useEffect } from 'react'
function App() {
  


  const [inputValue, setInputValue] = useState('') // use useState to define a state variable input value that stores the search value of the user and updates it as we go

  const [weatherData, setWeatherData] = useState({ // use useState to define all my weather variables in an object that will be used in my code to store the api data, and dynamically change them by defining setWeatherDate function
    weather_Condition: '',
    weather_Description: '',
    temperatureCelsius: null,
    temperatureFahrenheit: null,
    humidity: null,
    wind_Speed: null,
    weather_Icon: null,
    timezone: null
});

const [localTime, setLocalTime] = useState(''); // define a stateVariable localTime to handle time

  const cityName = inputValue; // assign inputValue to cityName

  const [savedLocation, setSavedLocations] = useState([])

  const addNewLocation = (cityName) => {
    if (savedLocation.includes(cityName)) {
      return;
    } else {
      setSavedLocations([...savedLocation, cityName]);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault(); // prevent form from submitting automatically
    console.log('Search initiated'); // log search to see if it is working
    const apiKey = import.meta.env.VITE_API_KEY; // get my api key into jsx from .env file

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`) // fetch api 
    .then(response => response.json()) // turn api response into json
    .then( data => { // retrieve data from api and assign it
        setWeatherData({
        weather_Condition: data.weather[0].main,
        weather_Description: data.weather[0].description,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        wind_Speed: data.wind.speed,
        temperatureInCelsius: data.main.temp - 273.15,
        temperatureInFahrenheit: ((data.main.temp - 273.15) * 9/5) + 32,
        weather_Icon: data.weather[0].icon,
        timezone: data.timezone
    })
    })
    .catch(error => {
        console.log("Error:", error);
      }); // catch errors 
  }
  const calculateLocalTime = (timezoneOffset) => { // calculate time 
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezoneOffset * 1000);
    return localTime.toLocaleTimeString();
  };

  useEffect(() => { // calculate time 
    if (weatherData.timezone !== null) {
      const interval = setInterval(() => {
        setLocalTime(calculateLocalTime(weatherData.timezone));
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [weatherData.timezone]);


  return( // html
    <>
    <div className="body">

      <h1 id="main-title">Weather App</h1>
      
      <form className='form'>
        <button type="submit" id="search-button" onClick={handleSearch}>
          <img src="https://www.svgrepo.com/show/127033/magnifying-glass.svg" alt="Magnifying Glass Icon"></img>
        </button>

        
        <input onChange = {(e) => setInputValue(e.target.value)} value={inputValue} id="search-Box" type="text" placeholder='Enter Location' required/>
      </form>

      <div className="saved">
        <button>Saved Locations</button>
      </div>

      <div className="image">
        <img src={`http://openweathermap.org/img/wn/${weatherData.weather_Icon}@2x.png`} alt="" id="weather-image"></img>
      </div>
      
      <div className="weather-info">

          <p id="temperature">Tempature: {weatherData.temperatureInFahrenheit} °F</p>

          <p id="humidity">Humidity: {weatherData.humidity}%</p>

          <p id="wind-speed">Wind Speeds: {weatherData.wind_Speed} m/s</p>

          <p id="weather-description">{weatherData.weather_Description}</p>

          <p id="weather-conditions">{weatherData.weather_Condition}</p>

          <p id="time">Time: {localTime}</p>
      </div>
      
    </div>
    </>
  );
}

export default App
