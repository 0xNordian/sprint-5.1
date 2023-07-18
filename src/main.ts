import { fetchPosts } from './apiClient';
import { fetchPosts2 } from './apiClient';
import { report, setReport } from './reportAcudits';

const jokeBtn = document.querySelector('.acudit-btn') as HTMLButtonElement;
const jokeRating = document.querySelector('.jokeRating') as HTMLDivElement;
const joke = document.querySelector('.typewrite') as HTMLAnchorElement;
const weatherTemp = document.querySelector('.current-temp') as HTMLDivElement;
const weatherDesc = document.querySelector('.weather-desc') as HTMLDivElement;
const descEmoji = document.querySelector('.desc-emoji') as HTMLDivElement;
const feelsLike = document.querySelector('.temp-feels-like') as HTMLDivElement;
const humidity = document.querySelector('.humidity') as HTMLDivElement;
const airSpeed = document.querySelector('.air-speed') as HTMLDivElement;

let isJokeRating = false;
let isJoke = false;
let btnStatus: -1 | 0 | 1;
let currentJoke: string;
btnStatus = -1;

async function randomJoke() {
    const randNumb = Math.floor(Math.random() * 2) + 1;
    //console.log("randNumb: ", randNumb);
    if (randNumb === 1) {
        fetchPosts();
        const data = await fetchPosts();
        currentJoke = data.joke;
        //console.log("fetchPosts: ", currentJoke)
        return currentJoke;
    } else if (randNumb === 2) {
        fetchPosts2();
        const data2 = await fetchPosts2();
        currentJoke = data2.value;
        //console.log("fetchPosts2: ", currentJoke)
        return currentJoke;
    }
}

jokeBtn.addEventListener('click', async () => {
    const emojis = jokeRating.querySelectorAll('.badJoke, .midJoke, .goodJoke');
    emojis.forEach((emoji) => emoji.classList.remove('active'));
    if (!isJokeRating) {
        jokeRating.style.display = 'flex'; // Show the element
        setTimeout(() => {
            jokeRating.style.opacity = '1';
            joke.style.opacity = '1'; // Fade in the element
        }, 0);
        isJokeRating = true;

        setTimeout(() => {
            jokeRating.classList.add('active');
        }, 0);
    }

    if (!isJoke) {
        joke.style.display = 'flex';
        isJoke = true;
    }
    btnStatus === -1 ? btnStatus = 0 : btnStatus = 1;
    try {
        const currentJoke = await randomJoke();
        const jokeDiv = document.querySelector('.typewrite');
        jokeDiv!.innerHTML = currentJoke;
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
    const clickedElement = event.target as HTMLElement;
    const emojiElement = clickedElement.closest('.badJoke, .midJoke, .goodJoke') as HTMLElement | null;

    if (emojiElement) {
        // Remove 'active' class from all emojis
        const emojis = jokeRating.querySelectorAll('.badJoke, .midJoke, .goodJoke');
        emojis.forEach((emoji) => emoji.classList.remove('active'));

        // Add 'active' class to the clicked emoji
        emojiElement.classList.add('active');
    }

    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
        const rating = target.getAttribute('data-rating');
        if (rating) {
            return score(rating);
        }
    }
});

async function getIPAddress(): Promise<string | undefined> {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipAddress = data.ip;
        return ipAddress;
    } catch (error) {
        console.error('Error:', error);
        return undefined;
    }
}

async function getGeolocation(ipAddress: string) {
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=ba11e34072144bda9e795858e82ae4e9&ip=${ipAddress}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
interface WeatherData {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: {
        main: string;
    }[];
    wind: {
        speed: number;
    };
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

    const ipAddress = await getIPAddress() as string;
    if (ipAddress) {
        console.log('User IP address:', ipAddress);
        const geolocationData = await getGeolocation(ipAddress);
        console.log('Geolocation data:', geolocationData);
        await fetchWeather(geolocationData.latitude, geolocationData.longitude);
        console.log('Weather Data:', weatherData);
        //console.log(`Temp at ${geolocationData.city}: ${weatherData.main.temp}`);

        switch (weatherData?.weather[0].main) {
            case 'Thunderstorm':
                descEmoji.innerHTML = `${weatherConditions.thunderstorm}`;
                weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
                break;
            case 'Drizzle':
                descEmoji.innerHTML = `${weatherConditions.drizzle}`;
                weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
                break;
            case 'Rain':
                descEmoji.innerHTML = `${weatherConditions.rain}`;
                weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
                break;
            case 'Snow':
                descEmoji.innerHTML = `${weatherConditions.snow}`;
                weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
                break;
            case 'Atmosphere':
                weatherDesc.innerHTML = `${weatherConditions.atmosphere} ${weatherData.weather[0].main}`;
                break;
            case 'Clear':
                descEmoji.innerHTML = `${weatherConditions.clear}`;
                weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
                break;
            case 'Clouds':
                descEmoji.innerHTML = `${weatherConditions.clouds}`;
                weatherDesc.innerHTML = `${weatherData.weather[0].main}`;
                break;
        }
        weatherTemp.innerHTML = `${weatherData?.main.temp.toFixed(1)} Cº`;
        feelsLike.innerHTML = `${weatherData?.main.feels_like.toFixed(1)} Cº`;
        feelsLike.title = "Temperature Feels Like";
        humidity.innerHTML = `${weatherData?.main.humidity}%`;
        humidity.title = "Humidity";
        airSpeed.innerHTML = `${weatherData?.wind.speed}`;
        airSpeed.title = "Air speed";
    } else {
        throw new Error('Check undefined')
    }

}

currentWeather();