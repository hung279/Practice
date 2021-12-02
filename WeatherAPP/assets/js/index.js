const API_ID = '6f800ddb668378f519218178a3b65d03'

const search = document.querySelector('#search');
const city = document.querySelector('.city');
const weatherCondition = document.querySelector('.weather-condition');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

search.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${API_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            console.log(data);
            city.innerHTML = data.name || '--';
            weatherCondition.innerHTML = data.weather[0].description || '--';
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temperature.innerHTML = Math.round(data.main.temp) || '--';
            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('h:mm') || '--';
            sunset.innerHTML = moment.unix(data.sys.sunset).format('h:mm') || '--';
            humidity.innerHTML = data.main.humidity || '--';
            windSpeed.innerHTML = data.wind.speed || '--';
        });
});