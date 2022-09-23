let APIkey = 'bfcdb7ca8a694a7cf1617bf136851250'

//Sending Query to url
$('#searchBtn').on('click', e => {
    if($('#searchBar').val().trim()===""){
        alert('Please enter a city name.')
    }else{
        var url = `${location.href.split('?')[0]}?q=${$('#searchBar').val().trim()}`
        location.replace(url)
    }
})

//Parse URL query
function parseQuery(type){
    let searchUrl = new URL(location.href)
    return `https://api.openweathermap.org/data/2.5/${type}?${decodeURIComponent(searchUrl.search.substring(1))}&appid=${APIkey}`
}

fetch(parseQuery('weather'))
    .then(response => {return response.json()})
    .then(data => {
    updateMainCard(data)
})

fetch(parseQuery('forecast'))
    .then(response => {return response.json()})
    .then(data => {
        createForecastCard(data.list[7])
        createForecastCard(data.list[15])
        createForecastCard(data.list[23])
        createForecastCard(data.list[31])
        createForecastCard(data.list[39])
})

function updateMainCard(data){
    $('#city').text(`${data.name}, ${data.sys.country}(${data.weather[0].main})`)
    $('#dateNow').text(moment.unix(data.dt).format('YYYY-MM-DD'))
    $('#iconNow').attr('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    $('#description').text(`Description: ${data.weather[0].description}`)
    $('#tempNow').text(`Temp: ${(data.main.temp-273.15).toFixed(2)} °C`)
    $('#windNow').text(`Wind: ${(data.wind.speed*3.6).toFixed(2)} km/h`)
    $('#humidNow').text(`Humidity: ${data.main.humidity}%`)
}

function createForecastCard(data){
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
