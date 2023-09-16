import { Temperature, Precipitation, Wind, CloudCoverage, WeatherPrediction, WeatherData } from '../models/models.js'


function fetchWeatherData(selectedCity) {
    
    var request = new XMLHttpRequest()

    // Define the URL with the selected city
    var url = `http://localhost:8080/data/${selectedCity}`

    // Configure the GET request
    request.open('GET', url, true)

    // callback function to handle the response
    request.onload = function () {
        if (request.status === 200) {
            var response = JSON.parse(request.responseText)
    //function to display the data we got - should be in separated script?
            let mapped = response.map(mapData)
            displayWeatherData(mapped)
        } else {
            document.getElementById('type').textContent = "Oops, something went wrong"
            console.error('Request failed with status:', request.status)
        }
    }

    request.send()
}


function displayWeatherData(weatherDataList) {
    // Populate with data
    let responseContent = ''
    weatherDataList.forEach(data => {
        
        responseContent += 
        `<p>Type: <span id="type">${data.getType()}</span></p>
        <p>Time: <span id="time">${data.getTime()}</span></p>
        <p>Place: <span id="place">${data.getPlace()}</span></p>
        <p>Value: <span id="value">${data.getValue()}</span> <span id="unit">${data.getUnit()}</span></p>`
        
        if (data.getPrecipitationType) {
            responseContent +=
                `<p>Precipitation Type: <span id="precipitationType">${data.getPrecipitationType()}</span></p>`
        }

        if (data.getDirection) {
            responseContent +=
                `<p>Direction: <span id="direction">${data.getDirection()}</span></p>`
        }
        responseContent += '<br/>'
    })
    
    document.getElementById('response-content').innerHTML = responseContent
}

// Get references to the dropdown select and fetch button
var citySelect = document.getElementById('citySelect')
var fetchButton = document.getElementById('fetchButton')

// Attach a click event listener to the fetch button
fetchButton.addEventListener('click', function () {
    var selectedCity = citySelect.value
    fetchWeatherData(selectedCity)
})

function mapData(data){

    let weatherData = WeatherData(data.time, data.place, data.value, data.type, data.unit)
    switch (data.type) {
        case 'temperature':
            return Temperature(weatherData)
        case 'precipitation':
            return Precipitation(weatherData, data.precipitation_type)
        case 'wind speed':
            return Wind(weatherData, data.direction)
        case 'cloud coverage':
            return CloudCoverage(weatherData)
        default:
            return weatherData;
    }
}