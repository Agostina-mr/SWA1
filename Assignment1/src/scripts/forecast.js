import {WeatherPrediction, TemperaturePrediction, PrecipitationPrediction, WindPrediction, CloudCoveragePrediction} from '../models/models.js'

// Get references to the dropdown select
let citySelect = document.getElementById('citySelect')

async function fetchForecast(selectedCity){
fetch(`http://localhost:8080/forecast/${selectedCity}`)
.then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }
    let responseJson = response.json()
    return responseJson
})
.then((data) => {
   let mapped = data.map(mapForecastData)
   displayForecastData(mapped)
  
})

.catch((error) => {
    console.error('Fetch Error:', error);
})
}

// Attach a click event listener to the select
citySelect.addEventListener("change", (event) => {
    var selectedCity = event.target.value
    fetchForecast(selectedCity)
})

// Call fetch while opening the page
fetchForecast(citySelect.value)
function mapForecastData(data){

    let forecastData = WeatherPrediction(data.time, data.place, data.from, data.to, data.type, data.unit)
    switch (data.type) {
        case 'temperature':
            return TemperaturePrediction(forecastData)
        case 'precipitation':
            return PrecipitationPrediction(forecastData, data.precipitation_types)
        case 'wind speed':
            return WindPrediction(forecastData, data.directions)
        case 'cloud coverage':
            return CloudCoveragePrediction(forecastData)
        default:
            return forecastData;
    }
}


function displayForecastData(forecastData){

    let content = ''

    for (let i = 0; i < forecastData.length; i += 4) {
        const timeInterval = forecastData.slice(i, i + 4);
        content += `<p>Time: <span id="time"><b>${timeInterval[0].getTime()}</b></span></p>`
       timeInterval.forEach(forecast => {
        content += 
        `<p>Type: <span id="type">${forecast.getType()}</span></p>
        <p>Max: <span id="max">${forecast.getMax()}</span></p>
        <p>Min: <span id="min">${forecast.getMin()}</span></p>
        <p>Unit: <span id="unit">${forecast.getMin()}</span></p>
       `
       })
       content += `</br>`
      }
      document.getElementById('forecast-info').innerHTML = content

}