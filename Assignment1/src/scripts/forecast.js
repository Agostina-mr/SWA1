import {WeatherPrediction, TemperaturePrediction, PrecipitationPrediction, WindPrediction, CloudCoveragePrediction} from '../models/models.js'
const url = 'http://localhost:8080/forecast'

fetch(url)
.then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }
    let responseJson = response.json()
    return responseJson
})
.then((data) => {
   let mapped = data.map(mapForecastData)
   console.log(mapped[0])
   console.log(mapped[0].getType())
   document.getElementById('forecast-info').innerHTML = mapped[0].getType()
})

.catch((error) => {
    console.error('Fetch Error:', error);
})



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