const API_KEY = 'your_api_key'; // Replace with your API key
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchHistory = document.querySelector('#search-history');

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = history.map(city => `<li>${city}</li>`).join('');
}

function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        history = history.slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        loadSearchHistory();
    }
}
