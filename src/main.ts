import { fetchPosts } from './apiClient';
import { report, setReport } from './reportAcudits';

const jokeBtn = document.querySelector('.acudit-btn') as HTMLButtonElement;
const jokeRating = document.querySelector('.jokeRating') as HTMLDivElement;
const joke = document.querySelector('.typewrite') as HTMLAnchorElement;
const weatherTemp = document.querySelector('.current-temp') as HTMLDivElement;
const weatherDesc = document.querySelector('.weather-desc') as HTMLDivElement;

let isJokeRating = false;
let isJoke = false;
let btnStatus: -1 | 0 | 1;
let currentJoke: string;
btnStatus = -1;
//console.log("btnStatus: ", btnStatus)


jokeBtn.addEventListener('click', async () => {
    if (!isJokeRating) {
        jokeRating.style.display = 'flex';
        isJokeRating = true;
    }

    if (!isJoke) {
        joke.style.display = 'flex';
        isJoke = true;
    }

    btnStatus === -1 ? btnStatus = 0 : btnStatus = 1;
    try {
        //console.log("btnStatus: ", btnStatus)
        fetchPosts();
        const data = await fetchPosts();
        currentJoke = data.joke;
        //console.log("Fetched data: ", data)
        const jokeDiv = document.querySelector('.typewrite');
        jokeDiv!.innerHTML = data.joke;

        // Pass the joke text to the report function
        if (btnStatus === 1) {
            setReport();
        }
    } catch (error) {
        console.error('Error: ', error)
    }
});

function score(dataRating: string) {
    switch (dataRating) {
        case 'bad':
            report(currentJoke, 1)
            break;
        case 'mid':
            report(currentJoke, 2)
            break;
        case 'good':
            report(currentJoke, 3)
            break;
    }
}

jokeRating.addEventListener('click', function (event: Event) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
        const rating = target.getAttribute('data-rating');
        if (rating) {
            return score(rating);
        }
    }
});

async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipAddress = data.ip;
        return ipAddress;
    } catch (error) {
        console.error('Error:', error);
    }
}

// async function getIPAddress() {
//     try {
//         const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=ba11e34072144bda9e795858e82ae4e9');
//         const data = await response.json();
//         const ipAddress = data.ip;
//         return ipAddress;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// async function getGeolocation(ipAddress: string) {
//     try {
//         const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
//         const data = await response.json();
//         // Process the geolocation data
//         return data;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
async function getGeolocation(ipAddress: string) {
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=ba11e34072144bda9e795858e82ae4e9&ip=${ipAddress}`);
        const data = await response.json();
        // Process the geolocation data
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
interface WeatherData {
    main: {
        temp: number;
    };
    weather: {
        main: string;
    }[];
}

let weatherData: WeatherData | undefined;

async function fetchWeather(lat: number, long: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=15b6a234495ce855e125003b9b61dfdf&units=metric`;

    return fetch(url, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((data: WeatherData) => {
            weatherData = { ...data };
        });
}

async function currentWeather() {
    const weatherConditions = {
        thunderstorm: "🌩️",
        drizzle: "🌧️",
        rain: "🌦️",
        snow: "🌨️",
        atmosphere: "💨",
        clear: "☀️",
        clouds: "☁️"
    }

    const ipAddress = await getIPAddress();
    console.log('User IP address:', ipAddress);
    const geolocationData = await getGeolocation(ipAddress);
    console.log('Geolocation data:', geolocationData);
    await fetchWeather(geolocationData.latitude, geolocationData.longitude);
    //console.log('Weather Data:', weatherData);
    //console.log(`Temp at ${geolocationData.city}: ${weatherData.main.temp}`);

    switch (weatherData?.weather[0].main) {
        case 'Thunderstorm':
            weatherDesc.innerHTML = `${weatherConditions.thunderstorm} ${weatherData.weather[0].main}`;
            break;
        case 'Drizzle':
            weatherDesc.innerHTML = `${weatherConditions.drizzle} ${weatherData.weather[0].main}`;
            break;
        case 'Rain':
            weatherDesc.innerHTML = `${weatherConditions.rain} ${weatherData.weather[0].main}`;
            break;
        case 'Snow':
            weatherDesc.innerHTML = `${weatherConditions.snow} ${weatherData.weather[0].main}`;
            break;
        case 'Atmosphere':
            weatherDesc.innerHTML = `${weatherConditions.atmosphere} ${weatherData.weather[0].main}`;
            break;
        case 'Clear':
            weatherDesc.innerHTML = `${weatherConditions.clear} ${weatherData.weather[0].main}`;
            break;
        case 'Clouds':
            weatherDesc.innerHTML = `${weatherConditions.clouds} ${weatherData.weather[0].main}`;
            break;
    }
    //weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
    weatherTemp.innerHTML = `${weatherData?.main.temp.toFixed(1)} Cº`;
}



currentWeather();


