
const API_KEY = '8e65305e720840af9b124555250708';
const API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// DOM elements for weather data
const cityName = document.getElementById('cityName');
const currentTime = document.getElementById('currentTime');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weatherIcon');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize with Seoul weather
window.addEventListener('load', () => {
    getWeatherData('Seoul');
});

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('도시 이름을 입력해주세요.');
        return;
    }
    
    await getWeatherData(city);
}

async function getWeatherData(city) {
    hideAllMessages();
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}?key=${API_KEY}&q=${city}&lang=ko`);
        
        if (!response.ok) {
            throw new Error('도시를 찾을 수 없습니다.');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message || '날씨 정보를 가져오는데 실패했습니다.');
    } finally {
        hideLoading();
    }
}

function displayWeatherData(data) {
    const { location, current } = data;
    
    // Update city name and time
    cityName.textContent = `${location.name}, ${location.country}`;
    currentTime.textContent = formatDateTime(location.localtime);
    
    // Update temperature and condition
    temp.textContent = `${Math.round(current.temp_c)}°C`;
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    condition.textContent = current.condition.text;
    feelsLike.textContent = `체감온도 ${Math.round(current.feelslike_c)}°C`;
    
    // Update weather details
    humidity.textContent = `${current.humidity}%`;
    wind.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;
    pressure.textContent = `${current.pressure_mb} mb`;
    
    showWeatherCard();
}

function formatDateTime(datetime) {
    const date = new Date(datetime);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul'
    };
    
    return date.toLocaleDateString('ko-KR', options);
}

function showWeatherCard() {
    weatherCard.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorMessage.querySelector('p').textContent = `⚠️ ${message}`;
    errorMessage.style.display = 'block';
    weatherCard.style.display = 'none';
}

function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function hideAllMessages() {
    weatherCard.style.display = 'none';
    errorMessage.style.display = 'none';
    loading.style.display = 'none';
}

// Add some popular cities as quick search
const popularCities = ['Seoul', 'Tokyo', 'New York', 'London', 'Paris', 'Beijing'];

// Create quick search buttons (optional enhancement)
function createQuickSearchButtons() {
    const quickSearchDiv = document.createElement('div');
    quickSearchDiv.className = 'quick-search';
    quickSearchDiv.innerHTML = '<p style="margin-bottom: 10px; color: #636e72; font-size: 14px;">인기 도시:</p>';
    
    popularCities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.className = 'quick-search-btn';
        button.style.cssText = `
            margin: 5px;
            padding: 8px 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s ease;
        `;
        
        button.addEventListener('click', () => {
            cityInput.value = city;
            getWeatherData(city);
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#74b9ff';
            button.style.color = 'white';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#f8f9fa';
            button.style.color = 'black';
        });
        
        quickSearchDiv.appendChild(button);
    });
    
    // Insert after search section
    const searchSection = document.querySelector('.search-section');
    searchSection.parentNode.insertBefore(quickSearchDiv, searchSection.nextSibling);
}

// Uncomment the line below to add quick search buttons
// createQuickSearchButtons();
