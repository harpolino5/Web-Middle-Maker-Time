const API_KEY = '951a789b2e6b41cba50132218253105';
const LOCATION = 'Kyiv';

fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&aqi=no`, {
    method: "get",
}).then((res) => res.json()).then(data => {
// console.log(data.last_updated) <input type="text" class="location" text="${data.location.name}">
    document.querySelector('.forecast').innerHTML = `
    <div class="info">
    <input type="text" class="location" text="${data.location.name}">
    <button class="location-btn"><i class="fas fa-search"></i></button>
    </div>
        <div class="weather_today">
      <div class="current">
        <h2>${new Date(data.location.localtime.split(" ")[0]).toLocaleDateString('en-US', { weekday: 'long' })} ${data.location.localtime.split(" ")[1]}</h2>
        <div class="temp">${MandP(data.current.temp_c)}°C</div>
        <div class="temp_feels"><span>Feels like:</span><span></span><span>${MandP(data.current.feelslike_c)}°C<span></div>
        <div class="precipitation"><span>Precipitation:</span><span></span><span>${data.current.precip_mm} mm</span></div>
        <div class="humidity"><span>Humidity:</span><span></span><span>${data.current.humidity}%</span></div>
        <div class="wind"><span>Wind:</span><span></span><span>${data.current.wind_kph} km/h</span></div>
      </div>

      <div class="periods">
        <div class="today_morning">Morning:${data.forecast.forecastday[0].hour[8].temp_c}°C</div>
        <div class="today_day">Day:${data.forecast.forecastday[0].hour[14].temp_c}°C</div>
        <div class="today_evening">Evening:${data.forecast.forecastday[0].hour[20].temp_c}°C</div>
        <div class="today_night">Night:${data.forecast.forecastday[0].hour[23].temp_c}°C</div>
      </div>
    </div>

    <div class="weather_next">
      <div class="next_1day">+1 day</div>
      <div class="next_2day">+2 days</div>
      <div class="next_3day">+3 days</div>
      <div class="check_if_want">Other</div>
    </div>`
}).catch(error => {
    console.error('Error fetching weather data:', error);
});

function updateWeatherClass(condition) {
  const body = document.body;
  body.className = ''; // Очистити попередні класи

  if (condition.includes("cloud")) {
    body.classList.add("weather-cloudy");
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    body.classList.add("weather-rainy");
  } else if (condition.includes("wind")) {
    body.classList.add("weather-windy");
  } else {
    body.classList.add("weather-clear");
  }
}

function MandP(index){
  if (index<=0){
    return index;
  }
  else{
    return "+"+index
  }
}