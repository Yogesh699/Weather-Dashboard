
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-GB');
const apiKey = "0d74d1779b1c25834c1df63aaf834c9a";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?&units=imperial";
const searchCityList = []

async function currentWeather(lat, lon) {
    const response = await fetch(apiURL + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
    const data = await response.json();
    document.querySelector('.city').innerHTML = data.name
    document.querySelector('.curDate').innerHTML = formattedDate;
    document.querySelector('.curLogo').setAttribute('src', "https://openweathermap.org/img/wn/" + data.weather[0].icon +".png")
    document.querySelector('.temp').innerHTML = data.main.temp + "°F"
    document.querySelector('.wind').innerHTML = data.wind.speed +" KPH"
    document.querySelector('.humidity').innerHTML = data.main.humidity + " %"
}

async function futureWeather(lat, lon){
    const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial";
    const currentDate = new Date();
    for (let i = 1; i < 6; i++) {
        currentDate.setDate(currentDate.getDate() + 1)
        const updatedDate = currentDate.toLocaleDateString('en-GB');
        let nextDay = currentDate.toISOString().split('T')[0];
        console.log(nextDay)
        const response = await fetch(apiURL + `&date=${nextDay}` + `&lat=${lat}` + `&lon=${lon}` + `&appid=${apiKey}`);
        const data = await response.json();
        const icon = data.weather[0].icon;
        const temp = data.main.temp + "°F"
        const wind = data.wind.speed +" KPH"
        const hum = data.main.humidity + " %"

        document.querySelector(`.date-${i}`).innerHTML = updatedDate;
        document.querySelector(`.logo-${i}`).setAttribute('src', "https://openweathermap.org/img/wn/" + icon +".png")
        document.querySelector(`.temp-${i}`).innerHTML = temp
        document.querySelector(`.wind-${i}`).innerHTML = wind
        document.querySelector(`.humidity-${i}`).innerHTML = hum
    }
}

function searchHistory(div){
    getlangLat(div.textContent)
}

document.querySelector('.searchBtn').addEventListener('click', ()=>{
    const city = document.querySelector('.searchField').value;
    getlangLat(city)
    document.querySelector('.searchField').value = ""
})

async function getlangLat(city){
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiURL);
    const data = await response.json();

    if(data.coord){
        if(!searchCityList.includes(city.toLowerCase())){
            const html = `<button onclick="searchHistory(this)" class="btn btn-secondary btn-sm w-100 mb-2 cities">${city}</button>`
            document.querySelector('.history').innerHTML += html
            searchCityList.push(city.toLowerCase())
            localStorage.setItem("cities",searchCityList)
        }
        const latitude = data.coord.lat
        const longitude = data.coord.lon
        currentWeather(latitude, longitude)
        futureWeather(latitude, longitude)
    }
}

localStorage.getItem('cities')?.split(",").forEach((city)=>{
    const html = `<button onclick="searchHistory(this)" class="btn btn-secondary btn-sm w-100 mb-2 cities">${city}</button>`
    document.querySelector('.history').innerHTML += html
    searchCityList.push(city.toLowerCase())
})

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(showPosition);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    currentWeather(position.coords.latitude, position.coords.longitude)
    futureWeather(position.coords.latitude, position.coords.longitude)
}
getLocation()

