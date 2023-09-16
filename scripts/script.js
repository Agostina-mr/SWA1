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

function setText(element, text) {
    document.getElementById(element).innerText = text
}

function displayWeatherData(weatherDataList) {
    // Populate with data
    let temp, precipitation, wind, cloud
    let temp_min = 1000
    let temp_max = -1000
    let last_day = new Date(weatherDataList[weatherDataList.length-1].getTime())
    last_day.setUTCHours(0, 0, 0, 0)

    for (let i = weatherDataList.length-1; i >= 0 ; i--) {
        const data = weatherDataList[i];

        let date = new Date(data.getTime())
        date.setUTCHours(0, 0, 0, 0)
        if (date.getTime() < last_day.getTime()) {
            break;
        }

        switch (data.getType()) {
            case 'temperature':
                temp = data
                if (temp_min > data.getValue()) {
                    temp_min = data.getValue()
                }
                break
            case 'precipitation':
                precipitation = data
                break
            case 'wind speed':
                wind = data
                break
            case 'cloud coverage':
                cloud = data
                break
            default:
                break
        }
    }

    setText('temp_time', temp.getTime())
    setText('temp_value', temp.getValue())
    setText('temp_unit', temp.getUnit())
    setText('temp_min', temp_min)
}

// Get references to the dropdown select
var citySelect = document.getElementById('citySelect')

// Attach a click event listener to the select
citySelect.addEventListener("change", (event) => {
    var selectedCity = event.target.value
    fetchWeatherData(selectedCity)
})

fetchWeatherData(citySelect.value)

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