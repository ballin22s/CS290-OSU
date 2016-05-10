var weather_api_string = '&APPID=4f5bcff87da17d71fc4f89eb44c1a8da';
var weather_url = 'http://api.openweathermap.org/data/2.5/weather?';

function weather_submit_pressed(event) {
    
    var search = document.getElementById("weather_input").value;
    
    if(isNaN(parseInt(search))) {
        var payload = encodeURI("q=" + search);
    } else {
        var payload = encodeURI("zip=" + search + ",us") 
    }
    
    var req = new XMLHttpRequest();
    var full_url = weather_url + payload + weather_api_string;
    
    req.open('GET', full_url, true);
    req.addEventListener('load', weather_response_received);
    req.send(null);
    
    console.log(full_url);
        
    event.preventDefault();
}

function weather_response_received(response) {
    var location = document.getElementById("location");
    var conditions = document.getElementById("conditions");
    var temp = document.getElementById("temp");
    var pressure = document.getElementById("pressure");
    var humidity = document.getElementById("humidity");
    var rainfall = document.getElementById("rainfall");
    var details = document.getElementById("details");
    
    var text_box = document.getElementById("weather_input");
    text_box.value = "";
    
    var req_status = response.srcElement.status;
    console.log(response);
    
    if(req_status >=200 && req_status < 400) {
        var response_json = JSON.parse(response.srcElement.responseText);
        
        if(response_json.cod == 404) {
	
            location.textContent = "";
            conditions.textContent = "";
            temp.textContent = "";
            pressure.textContent = "";
            humidity.textContent = "";
            rainfall.textContent = "";
            details.textContent = "City Not Found!";   

        } else {
        
            location.textContent = response_json.name;
            conditions.textContent = response_json.weather[0].main;
            temp.textContent = (parseFloat(response_json.main.temp) - 273.15).toFixed(2).toString() + " °C";
            pressure.textContent = response_json.main.pressure + " hPa";
            humidity.textContent = response_json.main.humidity + "%";

            var rainfall_data = response_json.rain;

            if(typeof(rainfall_data) == 'undefined') {
              rainfall.textContent = "";
            } else {
              rainfall.textContent = response_json.rain['3h'].toFixed(1) + "mm in the last 3 hours";
            }

            details.textContent = "City Found Sucessfully!";
        }
    } else {
        location.textContent = "";
        conditions.textContent = "";
        temp.textContent = "";
        pressure.textContent = "";
        humidity.textContent = "";
        rainfall.textContent = "";
        details.textContent = "Cannot connect to Weather Server!";
    }
}

function httpbin_submit(event){
    var text_input = document.getElementById("httpbin_input").value;
    
    var req = new XMLHttpRequest();
    var payload = {'mydata': text_input};
    req.open('POST', "http://httpbin.org/post", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', httpbin_response);
    req.send(JSON.stringify(payload));
    
    event.preventDefault();
}

function httpbin_response(response){
    var span_json = document.getElementById("json");
    var span_data = document.getElementById("reponse");
    
    var parsed_json = JSON.parse(response.srcElement.responseText);
    
    span_json.textContent = parsed_json.data;
    span_data.textContent = parsed_json.json.mydata;
}

function setup_events(){
    document.getElementById("submit_button").addEventListener("click", weather_submit_pressed);
    document.getElementById("httpbin_submit").addEventListener("click", httpbin_submit);
}

document.addEventListener('DOMContentLoaded', setup_events);