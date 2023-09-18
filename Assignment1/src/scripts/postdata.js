
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
  const formData = new FormData(document.getElementById('data-post'));
  const jsonData = {}
  formData.forEach((value, key) => {
    jsonData[key] = value;
  })

  postData(jsonData).then((data) => {
    console.log(data)
  })
}

