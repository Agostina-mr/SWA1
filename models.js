function Event(time, place) {

    const getTime = () => time
    const getPlace = () =>  place

    return { getTime, getPlace }
}

function WeatherData(time, place, value, type, unit) {

    const event = Event(time, place)

    const getValue = () => value
    const getType = () => type
    const getUnit = () => unit

    return { ...event, getValue, getType, getUnit }
}

function Temperature(time, place, value, type, unit) {

    const weatherData = WeatherData(time, place, value, type, unit)
    
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
    return { ...weatherData, convertToF, convertToC }
}

function Precipitation(time, place, value, type, unit, precipitationType) {

    const weatherData = WatherData(time, place, value, type, unit)

    const getPrecipitationType = () => precipitationType

    function convertToInches() {

        if (type === 'mm') {
        value = value * 25.4 
        unit = 'Inches'
        }
    }

    function convertToMm() {

        if (type === 'Inches'){
            value = value / 24.5 
            unit = 'mm'
        }

    } 

   return {...weatherData, getPrecipitationType, convertToInches, convertToMm}
}

function Wind(time, place, value, type, unit, direction){

    const weatherData = WeatherData(time, place, value, type, unit)

    const getDirection = () => direction

    return {...weatherData, getDirection}

}

function CloudCoverage(time, place, value, type, unit) {

    const weatherData = WeatherData(time, place, value, type, unit)

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

function TemperaturePrediction(time, place, max, min, type, unit){

    const prediction = WeatherPrediction(time, place, max, min, type, unit)

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

function PrecipitationPrediction(time, place, max, min, type, unit, expectedTypes){

    const prediction = WeatherPrediction(time, place, max, min, type, unit)

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

function WindPrediction(time, place, max, min, type, unit, expected_directions) {

    const prediction = WeatherPrediction(time, place, max, min, type, unit)
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
function CloudCoverage(time, place, max, min, type, unit){
    const prediction = WeatherPrediction(time, place, max, min, type, unit)

    return { ...prediction}
}