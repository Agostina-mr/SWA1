function Event(time, place) {

    const getTime = () => time
    const getPlace = () =>  place

    return { getTime, getPlace }
}

function WeatherData(time, place, value, type, unit) {

    const event = Event(time, place)

    const getValue = () => value
    const setValue = (_value) => value = _value
    const getType = () => type
    const getUnit = () => unit
    const setUnit = (_unit) => unit = _unit

    return { ...event, getValue, getType, getUnit, setValue, setUnit }
}

function Temperature(weatherData) {

    function convertToF() {

        if (weatherData.getUnit() === 'C') {
            weatherData.setValue((weatherData.getValue() * 9/5) + 32) 
            weatherData.setUnit('F')
        }  
    }

    function convertToC() { 
        
        if (weatherData.getUnit() === 'F') {
            weatherData.setValue((weatherData.getValue() - 32) * 5/9) 
            weatherData.setUnit('C')
        }   
    }
    return { ...weatherData, convertToF, convertToC }
}

function Precipitation(weatherData, precipitationType) {

    const getPrecipitationType = () => precipitationType

    function convertToInches() {

        if (weatherData.getUnit() === 'mm') {
            weatherData.setValue(weatherData.getValue() * 25.4)
            weatherData.setUnit('Inches')
        }  
    }

    function convertToMm() {

        if (weatherData.getUnit() === 'Inches') {
            weatherData.setValue(weatherData.getValue() / 25.4)
            weatherData.setUnit('mm')
        }  

    } 

   return {...weatherData, getPrecipitationType, convertToInches, convertToMm}
}

function Wind(weatherData, direction){

    const getDirection = () => direction

    return {...weatherData, getDirection}

}

function CloudCoverage(weatherData) {

    return {...weatherData}
}


function WeatherPrediction(time, place, max, min, type, unit){

    const event = Event(time, place)

    const getMax = () => max
    const getMin = () => min
    const getType = () => type
    const getUnit = () => unit

    function matches(weatherData = {}) {
        let _time, _place, _value, _type, _unit
        weatherData = _time, _place, _value, _type, _unit 

        return _time === time 
               && _place === place
               && _value >= min 
               && _value <= max
               && _type === type
               && _unit === unit

    }

    return {...event, getMax, getMin, getType, getUnit, matches}
}

function TemperaturePrediction(weatherPrediction){

    const prediction = weatherPrediction

    function convertToF() {

        if (unit === 'C') {
            value = (value * 9/5) + 32 
            unit = 'F'
        }  
    }

    function convertToC() {

        if (unit === 'F') {
            value = (value - 32) * 5/9
            unit ='C'
        }   
    }
    return { ...prediction, convertToF, convertToC }

}

function PrecipitationPrediction(weatherprediction, expectedTypes){

    const prediction = weatherprediction

    const getExpectedtypes = () => expectedTypes

    function matches(weatherData = {}) {
        let _time, _place, _value, _type, _unit, _precipitation_type
        weatherData = _time, _place, _value, _type, _unit, _precipitation_type

        return _time === time 
               && _place === place
               && _value >= min 
               && _value <= max
               && expectedTypes.includes(_precipitation_type)
               && _unit === unit
               && _type === type

    }

    function convertToF() {

        if (unit === 'C') {
            value = (value * 9/5) + 32 
            unit = 'F'
        }  
    }

    function convertToC() {

        if (unit === 'F') {
            value = (value - 32) * 5/9
            unit ='C'
        }   
    }
    return { ...prediction, convertToF, convertToC, matches, getExpectedtypes}
}

function WindPrediction(weatherPrediction, expected_directions) {

    const prediction = weatherPrediction
    const getExpectedDirections = () => expected_directions

    function matches(weatherData = {}) {
        let _time, _place, _value, _type, _unit, _direction
        weatherData = _time, _place, _value, _type, _unit, _direction

        return _time === time 
               && _place === place
               && _value >= min 
               && _value <= max
               && expected_directions.includes(_direction)
               && _unit === unit
               && _type === type
    }

    return { ...prediction, matches, getExpectedDirections}

}
function CloudCoveragePrediction(weatherPrediction){

    return { ...weatherPrediction}
}

export { WeatherData, Temperature, Precipitation, Wind, CloudCoverage, WeatherPrediction, TemperaturePrediction, PrecipitationPrediction, WindPrediction, CloudCoveragePrediction }