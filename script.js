// When the page loads, display what was stored in local storage
function searchHistory(){
  var searchHistoryE1 = $("<div>")
  savedCities = JSON.parse(localStorage.getItem("searchHistory"));
  searchHistoryE1.text(savedCities);
  $(".searched-cities").append(searchHistoryE1)
}
searchHistory();

// storing the city names the user searches into an array
var savedCities = [];
console.log(savedCities)

// creating a function that will have the information from the api displayed on the page
function displayWeather(response){
  var currentCity = $(".current-city"); 
    currentCity.text(response.city.name);
    var date = $(".date");
    // splitting the string so that the date and time are separate
    var dateOnly = response.list[0].dt_txt.split(" ");
    date.text(dateOnly[0]);
    // displaying the weather icon from the api
    var weatherIcon = $(".current-weather-icon");
    var icon = response.list[0].weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png"
    weatherIcon.attr("src", iconurl);
    // displaying the temperature data
    var currentTemp = $(".current-temp"); 
    currentTemp.text("The Current Temperature Is: " + response.list[0].main.temp + "°F"); 
    // displaying the humidity data
    var currentHumidity = $(".current-humidity"); 
    currentHumidity.text("The Current Humidity Is: " +response.list[0].main.humidity + "%"); 
    // displaying the wind data
    var currentWind = $(".current-wind"); 
    currentWind.text("The Current Wind Speed Is: " +response.list[0].wind.speed + " MPH"); 
  // Need to get the current UV index
    var lat = response.city.coord.lat;
    var lon = response.city.coord.lon;
    var UVURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=b1ae1cca243a43807d3e1c2bc792b425&cnt=1";
    $.ajax({
      url: UVURL,
      method: "GET"
    })
        .then(function(response){
          console.log(response)
            var UVIndex = $(".current-UV"); 
            UVIndex.text("UV Index: " + response[0].value);
        });
    
// creating a header that will display forecasted conditions
    $("#forecast-header").text("Forecasted Conditions");
  
// creating a for loop to append forecasted conditions
  for(i=1; i < 40; i++){
// since the api is returning the weather based on multiple times durin the day, only doing the iteration if the time is 9:00
    var time = response.list[i].dt_txt.split(" ")
// adding a condition to check for the time
    if (time[1] === "00:00:00"){
    // creating a div that will contain the 5 day forecast (will be appended into my HTML)
      var forecastDiv = $("<div>");
      forecastDiv.addClass("forecasted-conditions")
    // Creating a p element that will display the date based on the index in the array
      var forecastDate = $("<p>");
      forecastDate.addClass("forecast-date")
      forecastDate.text(time[0]);
    // Creating an image element that will dispaly the icon based on the index in the array
      var imgE1 = $("<img>");
      var forecastIcon = response.list[i].weather[0].icon;
      var iconurl = "http://openweathermap.org/img/w/" + forecastIcon + ".png"
      imgE1.attr("src", iconurl);
    // Creating a p element that will display the forecasted temp based on the index in the array
      var forecastTemp = $("<p>");
      forecastTemp.text(response.list[i].main.temp + "°F"); 
    // Creating a p element that will display the forecasted humidity based on the index in the array
      var forecastHumidity = $("<p>");
      forecastHumidity.text("Humidity: " + response.list[i].main.humidity + "%");
    // appending the forecasted data to the forecast div
      forecastDiv.append(forecastDate);
      forecastDiv.append(imgE1);
      forecastDiv.append(forecastTemp);
      forecastDiv.append(forecastHumidity);
    // appending the forecast div to the HTML
      $(".5-day-forecast").append(forecastDiv)
    }
  }
  }

// when the user clicks the search button
$(".search-button").on("click", function(event){
    event.preventDefault();
    // on click - clears the last searched city's forecast
    $(".5-day-forecast").empty();
    $(".forecasted-conditions").empty();
// store the value of the user's input in the variable "city" and push the value into the array
    var city = $("#city").val();
    savedCities.push(city);
// saving each city the user searches for in a button
    var searchHistory = $("<button>"); 
    searchHistory.addClass("searched-city search-history")
    searchHistory.attr("data-city", city)
    searchHistory.text(city); 
    $(".search-history").after(searchHistory);
  // store the url for the api in the variable "url"
    var url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=imperial&appid=b1ae1cca243a43807d3e1c2bc792b425";
  // using the ajax get method to "get" data from the api
  $.ajax({
    url: url,
    method: "GET"
  })
  // once the ajax function is finished, then do this function
  .then(function(response){
    // console.log the response so I can view the object that is returned from the api
      console.log(response);
      displayWeather(response);
    // setting the city to local storage
    localStorage.setItem("searchHistory", JSON.stringify(savedCities)); 
  })
  })

// When the user clicks on a city that has already been searched, call the api again. 
$(".searched-city").on("click", function(event){
  event.preventDefault();
  var city = $("#city").val();
  url = "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=imperial&appid=b1ae1cca243a43807d3e1c2bc792b425"; 

  $.ajax({
    url: url,
    method: "GET"
  })

  .then(function(response){
    displayWeather(response);
  })
 
})
