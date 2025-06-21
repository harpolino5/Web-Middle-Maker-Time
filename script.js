const API_KEY = '951a789b2e6b41cba50132218253105';
const LOCATION = 'Kyiv';

fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&aqi=no`, {
    method: "get",
}).then((res) => res.json()).then(data => {
    document.querySelector('.forecast').innerHTML = `
    <div class="info">
      <input type="text" class="location" text="Kyiv" placeholder="Enter city name">
      <button class="location-btn"><i class="fas fa-search"></i></button>
      <ul class="canBe"></ul>
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

function MandP(index) {
  if (index <= 0) {
    return index;
  }
  else {
    return "+" + index
  }
}

function morning() {
  toggleOverlay()
}

function toggleOverlay() {
  if (!document.querySelector(".overlay").classList.contains("open")) {
    document.querySelector(".overlay").classList.add("open")
  } else {
    document.querySelector(".overlay").classList.remove("open")
  }
}

let cities = [];
const searchBtn = document.querySelector('.location-btn');
const canBeList = document.querySelector('.canBe');
const input = document.querySelector('.location');
input.addEventListener('input', function () {
  const value = input.value;
  console.log(value)
  if (value.length >= 3) {
    fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${value}`)
      .then(response => response.json())
      .then(results => {
        canBeList.innerHTML = '';
        if (results.length === 0) {
          const li = document.createElement('li');
          li.textContent = 'Місто не знайдено';
          canBeList.appendChild(li);
        } else {
          results.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city.name;
            li.style.cursor = 'pointer';
            li.addEventListener('click', function () {
              input.value = city.name;
              canBeList.innerHTML = '';
              loadWeather(city.name);
            });
            canBeList.appendChild(li);
          });
        }
      });
  } else {
    canBeList.innerHTML = '';
  }
});



searchBtn.addEventListener('click', function () {
  loadWeather(input.value);
});

function loadWeather(location) {
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=4&aqi=no`)
    .then(res => res.json())
    .then(data => {
      renderCurrent(data);
      currentForecastData = data;
      updateWeatherClass(data.current.condition.text.toLowerCase());
    })
    .catch(err => alert('Не вдалося завантажити погоду'));
}


function renderCurrent(data, dayIndex = 0) {
  const day = data.forecast.forecastday[dayIndex];
  // оновити Today, температури, вологість, вітер...
  document.querySelector('.today_morning').onclick = () => showOverlay(day.hour, 8);
  document.querySelector('.today_day').onclick = () => showOverlay(day.hour, 14);
  document.querySelector('.today_evening').onclick = () => showOverlay(day.hour, 20);
  document.querySelector('.today_night').onclick = () => showOverlay(day.hour, 23);

  const nextBtns = document.querySelectorAll('.weather_next > div');
  nextBtns.forEach((btn, i) => {
    btn.onclick = () => renderCurrent(data, i + 1);
  });
}
