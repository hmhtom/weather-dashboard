let APIkey = 'bfcdb7ca8a694a7cf1617bf136851250'

//Parse function for current url query
//type: weather/forecast
//return: parsed ready-to-use API url
function parseQuery(type){
    let searchUrl = new URL(location.href)
    return `https://api.openweathermap.org/data/2.5/${type}${decodeURIComponent(searchUrl.search)}&appid=${APIkey}`
}

//Main weather card render
//data:parsed JSON from response
function renderWeatherCard(data){
    $('#city').text(`${data.name}, ${data.sys.country}(${data.weather[0].main})`)
    $('#dateNow').text(moment.unix(data.dt).format('YYYY-MM-DD'))
    $('#iconNow').attr('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    $('#description').text(`Description: ${data.weather[0].description}`)
    $('#tempNow').text(`Temp: ${(data.main.temp-273.15).toFixed(2)} °C`)
    $('#windNow').text(`Wind: ${(data.wind.speed*3.6).toFixed(2)} km/h`)
    $('#humidNow').text(`Humidity: ${data.main.humidity}%`)
}

//Current weather fetch function
function getWeather(){
    fetch(parseQuery('weather'))
    .then(response => {return response.json()})
    .then(data => {
    renderWeatherCard(data)
})
}

//Forecast weather card render
//data:parsed JSON from response
function renderForecastCard(data){
    let iconEl = $('<img>').attr('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`).attr('width', '80')
    let dateTimeEl = $('<h4>').text(moment.unix(data.dt).format('YYYY-MM-DD ha'))
    let titleEl = $('<li>').addClass('list-group-item').append(dateTimeEl, iconEl)
    let tempEl = $('<li>').addClass('list-group-item').text(`Temp: ${(data.main.temp-273.15).toFixed(2)} °C`)
    let windEl = $('<li>').addClass('list-group-item').text(`Wind: ${(data.wind.speed*3.6).toFixed(2)} km/h`)
    let humidEl = $('<li>').addClass('list-group-item').text(`Humidity: ${data.main.humidity}%`)

    let cardBodyEl = $('<ul>').addClass('list-group list-group-flush card-body').append(titleEl, tempEl, windEl, humidEl)
    let cardEl = $('<div>').addClass('card col-9 col-md-4 col-lg-2 p-0').append(cardBodyEl)
    $('#forecastContainer').append(cardEl)
}

//5-day forecast fetch function
function getForecast(){
    fetch(parseQuery('forecast'))
    .then(response => {return response.json()})
    .then(data => {
        renderForecastCard(data.list[7])
        renderForecastCard(data.list[15])
        renderForecastCard(data.list[23])
        renderForecastCard(data.list[31])
        renderForecastCard(data.list[39])
})
}

//Search History Btn Render
//info: textContent for Btn
function renderHistoryBtn(info){
    var htryBtn = $('<button>').addClass('btn btn-info btn-lg my-2').attr({'data-bs-toggle':'offcanvas','data-bs-target':'#searchPannel'}).text(info)
    $('#historyContainer').append(htryBtn)
}

//Add query to website with first item in local storage
//If empty, will add 'toronto' as default query
function renderHistory(){
    if(localStorage.getItem('history') !== null){
        let searchHistory = JSON.parse(localStorage.getItem('history'))
        //Location replace acts like recursive calls, base condition added
        if(location.href.split('?')[1] !== `q=${encodeURIComponent(searchHistory[0])}`)
            location.replace(`${location.href.split('?')[0]}?q=${encodeURIComponent(searchHistory[0])}`)
        for(i in searchHistory){
            renderHistoryBtn(searchHistory[i])
        }
    }else{
        //Location replace acts like recursive calls, base condition added
        if(location.href.split('?')[1] !== `q=toronto`){
            location.replace(`${location.href.split('?')[0]}?q=toronto`)
        }
    }
}

//Search button
$('#searchBtn').on('click', e => {
    if($('#searchBar').val().trim()===""){
        alert('Please enter a city name.')
    }else{
        let searchHistory
        if(localStorage.getItem('history') === null){
            searchHistory = [$('#searchBar').val().trim()]
        }else{
            searchHistory = JSON.parse(localStorage.getItem('history'))
            searchHistory.unshift($('#searchBar').val().trim())
            if(searchHistory.length>8){
                searchHistory.pop()
            }
        }
        localStorage.setItem('history', JSON.stringify(searchHistory))
        location.replace(`${location.href.split('?')[0]}`)
    }
})

//Search History button
$('#historyContainer').on('click', 'button', e => {
    let searchHistory = JSON.parse(localStorage.getItem('history'))
    let index = searchHistory.findIndex(item => item === e.target.textContent)
    searchHistory.splice(index, 1)
    searchHistory.unshift(e.target.textContent)
    localStorage.setItem('history', JSON.stringify(searchHistory))
    location.replace(`${location.href.split('?')[0]}`)
})

//Clear button
$('#clear').on('click', e => {
    localStorage.removeItem('history')
    $('#historyContainer').html("")
})

//When page load, render first item in localstorage(most recent search history)
renderHistory()
//Render weather and forecast cards based on query
getWeather()
getForecast()