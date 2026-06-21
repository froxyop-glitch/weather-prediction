// --- API Configuration ---
// To get live data, register for free at openweathermap.org, get a key, and swap it here.
const API_KEY = "YOUR_API_KEY_HERE"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// --- DOM Target Mapping ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorBox = document.getElementById('error-message');
const weatherDashboard = document.getElementById('weather-dashboard');

const cityName = document.getElementById('city-name');
const weatherDesc = document.getElementById('weather-desc');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// --- Main Fetch Executions ---
async function fetchWeather(city) {
    if (!city.trim()) return;

    // Fallback Mock System: Runs if you haven't assigned your OpenWeather API key yet
    if (API_KEY === "YOUR_API_KEY_HERE") {
        showMockData(city);
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error("City destination invalid");
        }
        
        const data = await response.json();
        renderDashboard(data);
    } catch (error) {
        showError();
    }
}

// --- Render Layout Functions ---
function renderDashboard(data) {
    errorBox.classList.add('hidden');
    weatherDashboard.classList.remove('hidden');

    cityName.textContent = data.name;
    weatherDesc.textContent = data.weather[0].description;
    temperature.textContent = Math.round(data.main.temp);
    
    // Process local elements
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Converts m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;
}

function showError() {
    weatherDashboard.classList.add('hidden');
    errorBox.classList.remove('hidden');
}

// --- Local Simulation Logic Generator ---
function showMockData(city) {
    errorBox.classList.add('hidden');
    weatherDashboard.classList.remove('hidden');
    
    // Generate realistic floating variations based on simple word hashes
    const seed = city.length;
    const mockTemp = Math.floor(12 + (seed % 20)); 
    const mockHumid = 40 + (seed * 3 % 50);
    const mockWind = 5 + (seed % 25);

    cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1) + " (Demo)";
    weatherDesc.textContent = seed % 2 === 0 ? "Clear Skies" : "Scattered Showers";
    temperature.textContent = mockTemp;
    feelsLike.textContent = `${mockTemp + 2}°C`;
    humidity.textContent = `${mockHumid}%`;
    windSpeed.textContent = `${mockWind} km/h`;
    pressure.textContent = "1013 hPa";
}

// --- Event Trigger Hooks ---
searchBtn.addEventListener('click', () => fetchWeather(cityInput.value));

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});
