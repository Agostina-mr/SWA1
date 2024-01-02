let useFetch = true

export function setUseFetch(_useFetch) {
    useFetch = _useFetch
}

export async function getData(url) {
    return request('GET', url)
}

export async function postData(url, data) {
    return request('POST', url, data)
}

function request(method, url, data = null) {
    const body = data ? JSON.stringify(data) : null;

    if (useFetch) {
        return fetchData(method, url, body)
    } else {
        return ajaxRequest(method, url, body)
    }
}

async function fetchData(method, url, body = null) {
    const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body, 
      })
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    console.log("Fetched")
    return await response.json()
}

function ajaxRequest(method, url, body = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                console.log("Ajaxed")
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        }
        xhr.send(body)
    })
}