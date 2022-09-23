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
function parseQuery(){
    let searchUrl = new URL(location.href)
    return `http://api.openweathermap.org/geo/1.0/direct?${decodeURIComponent(searchUrl.search.substring(1))}&limit=1&appid=${APIkey}`
}

//Current weather fetch
fetch(parseQuery())
    .then(response => {return response.json()})
    .then(data => {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${APIkey}`)
})
.then(response => {return response.json()})
        .then(data => {
    updateMainCard(data)
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