const API_KEY = "f9054af236bde91fa6cc23bc88bf409d";
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchHistory = document.querySelector("#search-history");
const currentWeather = document.querySelector("#current-weather");
const forecast = document.querySelector("#forecast");

function loadSearchHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.innerHTML = history.map((city) => `<li>${city}</li>`).join("");
}

function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    history = history.slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    loadSearchHistory();
  }
}
async function getCoordinates(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("City not found");
  }

  const data = await response.json();
  return { lat: data.coord.lat, lon: data.coord.lon };
}

async function getWeatherForecast(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );
  return await response.json();
}

function updateCurrentWeather(weatherData) {
  const { city, list } = weatherData;
  const [current] = list;
  const { main, weather, wind, dt_txt } = current;
  const date = new Date(dt_txt).toLocaleDateString();

  currentWeather.innerHTML = `
        <h2>${city.name} (${date})</h2>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
        <p>Temperature: ${main.temp} °F</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

function updateForecast(forecastData) {
  const dailyData = forecastData.list.filter((_, index) => index % 8 === 0);
  forecast.innerHTML = dailyData
    .map((data) => {
      const { main, weather, wind, dt_txt } = data;
      const date = new Date(dt_txt).toLocaleDateString();
      return `
            <div>
                <h3>${date}</h3>
                <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
                <p>Temperature: ${main.temp} °F</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
            </div>
        `;
    })
    .join("");
}

async function searchCity(city) {
  try {
    const { lat, lon } = await getCoordinates(city);
    const weatherData = await getWeatherForecast(lat, lon);
    updateCurrentWeather(weatherData);
    updateForecast(weatherData);
    saveSearchHistory(city);
  } catch (error) {
    alert(error.message);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    searchCity(city);
    searchInput.value = "";
  }
});

searchHistory.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    searchCity(event.target.textContent);
  }
});

loadSearchHistory();
