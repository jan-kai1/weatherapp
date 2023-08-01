
import "./style.css"
import {weatherKey,pixabayKey} from './keys.js'


const wrappedWeather = wrapperFn(getWeather);

wrappedWeather("singapore")

document.addEventListener("DOMContentLoaded", function()
{
    let searchForm = document.querySelector("#newSearch");
    searchForm.addEventListener("submit",function(e)
    {
        e.preventDefault();
        let cityName = document.querySelector("#cityName").value
        document.querySelector("#cityName").value = "";
        cityName = cityName.trim()
        cityName = cityName.replace(/ /g,"_");
        wrappedWeather(cityName);
        
    })
})










function wrapperFn(fn)
{
    return function(...params)
    {
        return fn(...params)
        .then(function(response)
        {
            updateElements(response);

        })
        .catch(function(err)
        {
            handleError(err)
        })
    }
}



function updateElements(data)
{
    //select all elements that need to be updated
    // object.current.condition['text']
    //object.current.condition.temp_c and object.current.condition.feelslike_c
    //object.current.humidity and .precip_mm
    let errorMsg =  document.querySelector(".error");
    errorMsg.textContent ="";
    console.log(data)


    let location = document.querySelector(".location");
    let weather = document.querySelector(".weather");
    let humidity = document.querySelector(".humidity");
    let realTemp = document.querySelector(".realTemp");
    let feelsLike  = document.querySelector(".feelsLike")
    let precip = document.querySelector(".precip");
    location.textContent = data.location.country + ", "+ data.location.name;
    weather.textContent = "Current Weather: " + data.current.condition.text;
    humidity.textContent = "Humidity: " + data.current.humidity;
    
    realTemp.textContent = "Current Temperature is " + data.current.temp_c;
    feelsLike.textContent = "Feels Like " + data.current.feelslike_c
    precip.textContent = "Precipitation: " + data.current.precip_mm + "mm";

    //make background image of country
    
    let image =  fetch("https://pixabay.com/api/?key="+pixabayKey+"&q="+data.location.name, {mode:"cors"})
    image.then(async function(response)
    {
        let imageParsed = await response.json()
        return imageParsed
    })
    .then(function(response)
    {

        let imageURL = response.hits[0].largeImageURL
        let body = document.querySelector("body")
        body.style.backgroundImage = "url('" + imageURL+"')"
        body.style.backgroundSize ="cover"
        body.style.backgroundPosition="center"
    })
    .catch(function(err)
    {
        console.log("image not found")
        console.log(err)
        let body = document.querySelector("body")
        body.style.backgroundImage = "";
    })
    
    
}

async function getWeather(city)
{
    
    let response = await fetch("http://api.weatherapi.com/v1/current.json?key=" + weatherKey+"&q=" + city,{mode:'cors'});
    let parsedResponse = await response.json()
    //parsedResponse here is still a promise without await for json
    if (parsedResponse.error)
    {
        throw parsedResponse
    }
    return parsedResponse;
    
    
}
function handleError(error)
{
    console.log("error occurred")
    console.log(error)
    console.log(error.error.code, error.error.message)
    let errorMsg = document.querySelector(".error");
    errorMsg.textContent = `Error, ${error.error.message}. Code ${error.error.code}`

    return;
}