import _ from 'lodash'
import { Temperature, Precipitation, Wind, CloudCoverage, WeatherData } from '../models/models.js'


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
            displayLatestData(mapped)
        } else {
            console.error('Request failed with status:', request.status)
        }
    }

    request.send()
}

// Get references to the dropdown select
var citySelect = document.getElementById('citySelect')

// Attach a click event listener to the select
citySelect.addEventListener("change", (event) => {
    var selectedCity = event.target.value
    fetchWeatherData(selectedCity)
})

// Call xml request
fetchWeatherData(citySelect.value)

function displayLatestData(weatherDataList) {
    //find the last record
    let last_data = weatherDataList.slice(-4)
    
    let temp, precipitation, wind, cloud

    last_data.forEach(last_item => {
        switch (last_item.getType()) {
            case 'temperature':
                temp = last_item
            case 'precipitation':
                precipitation = last_item
            case 'wind speed':
                wind = last_item
            case 'cloud coverage':
                cloud = last_item
            default:
                break
        }
    })

    setText('temp_time', temp.getTime())
    setText('temp_value', temp.getValue())
    setText('temp_unit', temp.getUnit())

    setText('wind_time', wind.getTime())
    setText('wind_dir', wind.getDirection())
    setText('wind_value', wind.getValue())

    setText('prec_type', precipitation.getPrecipitationType())
    setText('prec_time', precipitation.getTime())
    setText('prec_value', precipitation.getValue())
    setText('prec_unit', precipitation.getUnit())

    setText('cloud_time', cloud.getTime())
    setText('cloud_value', cloud.getValue())
    
}


function displayYesterdaysData(weatherDataList) {
    // Populate with data
    let temp, precipitation, wind
    //let temp_min = 1000
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
                 //   temp_min = data.getValue()
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

    
}
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

//help function
function setText(element, text) {
    document.getElementById(element).innerText = text
}
