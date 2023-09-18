
// Example POST method implementation:
async function postData(data = {}) {
  // Default options are marked with *
  const response = await fetch('http://localhost:8080/data', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json()
}


function submitData() {
  let jsonData = [{"type": "temperature",
  "time": readFromForm('temperature_time'),
  "place": readFromForm('temperature_place'),
  "value": readFromForm('temperature_value'),
  "unit": readFromForm('temperature_unit')},
 {"type": "precipitation",
  "time": readFromForm('prec_time'),
  "place": readFromForm('prec_place'),
  "value": readFromForm('prec_value'),
  "unit": readFromForm('prec_unit'),
  "precipitation_type": readFromForm('p_prec_type')},
 {"type": "wind speed",
  "time": readFromForm('wind_speed_time'),
  "place": readFromForm('wind_speed_place'),
  "value": readFromForm('wind_speed_value'),
  "unit": readFromForm('wind_speed_unit'),
  "direction": readFromForm('wind_speed_direction')},
{"type": "cloud coverage",
  "time": readFromForm('cloud_coverage_time'),
  "place": readFromForm('cloud_coverage_place'),
  "value": readFromForm('cloud_coverage_value'),
  "unit": readFromForm('cloud_coverage_unit')}]

  postData(jsonData).then((response) => {
    console.log("Response = " + response)
  })
}

let submitButton = document.getElementById('submit-button')
submitButton.addEventListener("click", () => submitData())

function readFromForm(element){
  return (document.getElementById(element)).value
}