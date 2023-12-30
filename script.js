// Get the current date formated it as a string
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-GB');

// OpenWeatherMap API key and base URL for weather data
const apiKey = "0d74d1779b1c25834c1df63aaf834c9a";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial";

// List to store search history
const searchCityList = [];

// Function to fetch and display current weather information
async function currentWeather(lat, lon) {
    // Fetch weather data for the specified latitude and longitude
    const response = await fetch(apiURL + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
    const data = await response.json();

    // Update HTML elements with current weather data
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.curDate').innerHTML = formattedDate;
    document.querySelector('.curLogo').setAttribute('src', "https://openweathermap.org/img/wn/" + data.weather[0].icon +".png");
    document.querySelector('.temp').innerHTML = data.main.temp + "°F";
    document.querySelector('.wind').innerHTML = data.wind.speed +" KPH";
    document.querySelector('.humidity').innerHTML = data.main.humidity + " %";
}

// Function to fetch and display future weather forecast for the next 5 days
async function futureWeather(lat, lon) {
    // Base URL for future weather data
    const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial";
    const currentDate = new Date();

    // Loop to get weather data for the next 5 days
    for (let i = 1; i < 6; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const updatedDate = currentDate.toLocaleDateString('en-GB');
        let nextDay = currentDate.toISOString().split('T')[0];

        // Fetch weather data for the specified date, latitude, and longitude
        const response = await fetch(apiURL + `&date=${nextDay}` + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
        const data = await response.json();

        // Extract weather information and update HTML elements
        const icon = data.weather[0].icon;
        const temp = data.main.temp + "°F";
        const wind = data.wind.speed +" KPH";
        const hum = data.main.humidity + " %";

        document.querySelector(`.date-${i}`).innerHTML = updatedDate;
        document.querySelector(`.logo-${i}`).setAttribute('src', "https://openweathermap.org/img/wn/" + icon +".png");
        document.querySelector(`.temp-${i}`).innerHTML = temp;
        document.querySelector(`.wind-${i}`).innerHTML = wind;
        document.querySelector(`.humidity-${i}`).innerHTML = hum;
    }
}

// Function to handle search history button clicks
function searchHistory(div) {
    getlangLat(div.textContent);
}

// Event listener for the search button
document.querySelector('.searchBtn').addEventListener('click', () => {
    // Get the city from the search field and initiate a search
    const city = document.querySelector('.searchField').value;
    getlangLat(city);
    document.querySelector('.searchField').value = "";
});

// Function to fetch latitude and longitude for a given city
async function getlangLat(city) {
    // API URL for city-based weather data
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Fetch weather data for the specified city
    const response = await fetch(apiURL);
    const data = await response.json();

    // Check if coordinates are available in the response
    if (data.coord) {
        // Add the city to the search history if not already present
        if (!searchCityList.includes(city.toLowerCase())) {
            const html = `<button onclick="searchHistory(this)" class="btn btn-secondary btn-sm w-100 mb-2 cities">${city}</button>`;
            document.querySelector('.history').innerHTML += html;
            searchCityList.push(city.toLowerCase());
            localStorage.setItem("cities", searchCityList);
        }

        // Get latitude and longitude, and fetch and display current and future weather
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        currentWeather(latitude, longitude);
        futureWeather(latitude, longitude);
    }
}

// Load search history from local storage on page load
localStorage.getItem('cities')?.split(",").forEach((city) => {
    const html = `<button onclick="searchHistory(this)" class="btn btn-secondary btn-sm w-100 mb-2 cities">${city}</button>`;
    document.querySelector('.history').innerHTML += html;
    searchCityList.push(city.toLowerCase());
});

// Function to get the user's current location and display weather information
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else { 
        // Display an error message if geolocation is not supported
        console.error("Geolocation is not supported by this browser.");
    }
}

// Function to display weather information based on the user's current location
function showPosition(position) {
    currentWeather(position.coords.latitude, position.coords.longitude);
    futureWeather(position.coords.latitude, position.coords.longitude);
}

// Get the user's location on page load
getLocation();
