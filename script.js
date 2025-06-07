const API_KEY = '951a789b2e6b41cba50132218253105';
const LOCATION = 'Kyiv';

fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LOCATION}&aqi=no`, {
    method: "get",
}).then((res) => res.json()).then(data => {
// console.log(data.last_updated)
    document.querySelector('.forecast').innerHTML = `
    <input type="text" class="location">
    <h3>data</h3>
        <div class="weather_today">
      <div class="current">
        <h2>Today</h2>
        <div class="data"></div>
        <div class="temp"></div>
        <div class="temp_feels"></div>
        <div class="precipitation"></div>
        <div class="humidity"></div>
        <div class="wind"></div>
      </div>

      <div class="periods">
        <div class="today_morning">Morning</div>
        <div class="today_day">Day</div>
        <div class="today_evening">Evening</div>
        <div class="today_night">Night</div>
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

