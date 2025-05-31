fetch("http://api.weatherapi.com/v1/forecast.json?key=951a789b2e6b41cba50132218253105&q=Tokyo&days=3&aqi=no&alerts=no", {
    method: "GET"
})
    .then(res => res.json())
    .then(data => {
        forecastContainer = document.querySelector(".forecast");
        forecastContainer.innerHTML = "";

        data.forecast.forecastday.forEach(forecastday => {
            html = `
                <div class="forecast-item">
                    <span>${forecastday.date}</span>
                    <h2>${forecastday.day.avgtemp_c}°C</h2>
                    <p>${forecastday.day.condition.text}</p>
                </div>
            `;
            forecastContainer.innerHTML += html;
        });

        document.querySelector(".feels-like h1").textContent = `${data.current.feelslike_c}°C`;
    });
