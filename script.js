const API_KEY = '951a789b2e6b41cba50132218253105';
const LOCATION = 'Kyiv';
let weatherData = null;

fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&aqi=no`, {
  method: "get",
})
  .then((res) => res.json())
  .then(data => {
    document.querySelector('.forecast').innerHTML = `
      <div class="weather_today">
        <div class="current">
          <h2>${new Date(data.location.localtime.split(" ")[0])
            .toLocaleDateString('en-US', { weekday: 'long' })} 
            ${data.location.localtime.split(" ")[1]}
          </h2>
          <div class="temp">${MandP(data.current.temp_c)}°C</div>
          <div class="temp_feels">
            <span>Feels like:</span><span></span><span>${MandP(data.current.feelslike_c)}°C</span>
          </div>
          <div class="precipitation">
            <span>Precipitation:</span><span class="dot-line"></span><span>${data.current.precip_mm} mm</span>
          </div>
          <div class="humidity">
            <span>Humidity:</span><span></span><span>${data.current.humidity}%</span>
          </div>
          <div class="wind">
            <span>Wind:</span><span></span><span>${data.current.wind_kph} km/h</span>
          </div>
        </div>
        <div class="periods">
          <div class="today_morning">Morning: ${MandP(data.forecast.forecastday[0].hour[8].temp_c)}°C</div>
          <div class="today_day">Day: ${MandP(data.forecast.forecastday[0].hour[14].temp_c)}°C</div>
          <div class="today_evening">Evening: ${MandP(data.forecast.forecastday[0].hour[20].temp_c)}°C</div>
          <div class="today_night">Night: ${MandP(data.forecast.forecastday[0].hour[23].temp_c)}°C</div>
        </div>
      </div>
      <div class="weather_next">
        <div class="next_1day">+1 day</div>
        <div class="next_2day">+2 days</div>
        <div class="next_3day">+3 days</div>
        <div class="check_if_want">Other</div>
      </div>
      <div class="overlay">
        <div class="overlay_inner">
          <button class="close" onclick="closeLay()"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    `;
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });

function MandP(index) {
  if (index <= 0) {
    return index;
  }
  else {
    return "+" + index
  }
}

document.querySelector('.location-btn').addEventListener('click', () => {
  const city = document.querySelector('.location-input').value.trim();
  if (city) {
    currentCity = city;
    getWeather(city);
  }
});

function getWeather(city) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=4&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
      weatherData = data;
      renderToday();
      setWeatherBackground(data.current.condition.text);
      setNextDayEvents();
    })
    .catch(err => {
      alert('City not found!');
      console.error(err);
    });
}

function renderToday(index = 0) {
  const day = weatherData.forecast.forecastday[index];
  const current = index === 0 ? weatherData.current : day.day;
  const hour = day.hour;

  const temp = index === 0 ? MandP(current.temp_c) : MandP(day.day.avgtemp_c);
  const feels = index === 0 ? MandP(current.feelslike_c) : '-';
  const precip = current.precip_mm;
  const hum = current.humidity;
  const wind = current.wind_kph;
  const time = index === 0 ? weatherData.location.localtime : day.date;

  document.querySelector('.weather_today .current').innerHTML = `
    <h2>${new Date(time).toLocaleDateString('en-US', { weekday: 'long' })}</h2>
    <div class="temp">${temp}°C</div>
    <div class="temp_feels"><span>Feels like:</span><span></span><span>${feels}°C</span></div>
    <div class="precipitation"><span>Precipitation:</span><span></span><span>${precip} mm</span></div>
    <div class="humidity"><span>Humidity:</span><span></span><span>${hum}%</span></div>
    <div class="wind"><span>Wind:</span><span></span><span>${wind} km/h</span></div>
    ${index !== 0 ? '<button class="return-today" onclick="renderToday(0)">Return to Today</button>' : ''}
  `;

  document.querySelector('.today_morning').textContent = `Morning: ${hour[8].temp_c}°C`;
  document.querySelector('.today_day').textContent = `Day: ${hour[14].temp_c}°C`;
  document.querySelector('.today_evening').textContent = `Evening: ${hour[20].temp_c}°C`;
  document.querySelector('.today_night').textContent = `Night: ${hour[23].temp_c}°C`;

  ['morning', 'day', 'evening', 'night'].forEach((period, idx) => {
    document.querySelector(`.today_${period}`).onclick = () => showOverlay(index, idx);
  });
}

function setNextDayEvents() {
  document.querySelector('.next_1day').onclick = () => renderToday(1);
  document.querySelector('.next_2day').onclick = () => renderToday(2);
  document.querySelector('.next_3day').onclick = () => renderToday(3);
  document.querySelector('.check_if_want').onclick = () => {
    document.querySelector('.overlay_inner').innerHTML = `
      <button class="close" onclick="closeLay()"><i class="fa-solid fa-xmark"></i></button>
      <h1>Check this tomorrow</h1>
    `;
    document.querySelector('.overlay').classList.add('open');
  };
}

function closeLay() {
  document.querySelector('.overlay').classList.remove('open');
}

function showOverlay(dayIndex, periodIndex) {
  const periods = [8, 14, 20, 23];
  const hourStart = periods[periodIndex];
  const data = weatherData.forecast.forecastday[dayIndex].hour.slice(hourStart - 2, hourStart + 3);

  let html = `
    <button class="close" onclick="closeLay()"><i class="fa-solid fa-xmark"></i></button>
    <div class="overlay-grid">
  `;

  data.forEach(h => {
    html += `<div>${h.time.split(' ')[1]}</div><div>${h.temp_c}°C, ${h.condition.text}</div>`;
  });

  html += `</div>`;

  console.log(html)
  document.querySelector('.overlay_inner').innerHTML = html;
  document.querySelector('.overlay').classList.add('open');
}

function setWeatherBackground(condition) {
  const lower = condition.toLowerCase();
  document.body.classList.remove('weather-cloudy', 'weather-rainy', 'weather-windy');

  if (lower.includes('cloud')) {
    document.body.classList.add('weather-cloudy');
  } else if (lower.includes('rain') || lower.includes('drizzle')) {
    document.body.classList.add('weather-rainy');
  } else if (lower.includes('wind')) {
    document.body.classList.add('weather-windy');
  } else {
    document.body.style.background = 'linear-gradient(to right, #eef2f3, #7ca1d6)';
  }
}

getWeather(LOCATION);
document.querySelector('.check_if_want').onclick = () => {
  document.querySelector('.overlay_inner').innerHTML = `
    <button class="close" onclick="closeLay()"><i class="fa-solid fa-xmark"></i></button>
    <div class="dark-overlay-content">
      <h1>Check this tomorrow</h1>
    </div>
  `;
  document.querySelector('.overlay').classList.add('open');
};
