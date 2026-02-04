const lang = 'pt_br';
const units = 'metric';
const baseurl = 'https://api.openweathermap.org/data/2.5';
const api = '/weather';
var key = '';
var param2 = '';

window.addEventListener("DOMContentLoaded", function() {
    key = getCookie("api.key");

    if (key == '') {
        key = prompt("KEY da API openweathermap", "Digite a KEY");
        setCookie('api.key', key, 365);
    }
    param2 = '&appid=' + key + '&lang=' + lang + '&units=' + units;
    
    const divPrevisao = document.getElementById("divPrevisao");

    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        var param1 = '?lat=' + lat + '&lon=' + lon;

        var url = baseurl + api + param1 + param2;

        xhr = new XMLHttpRequest();
        xhr.addEventListener("loadend", function(e) {
            MostrarDadosGEO(e.srcElement.response);
        });

        xhr.open("GET", url);
        xhr.send();
    });

    function MostrarDadosGEO(dados) {
        var obj = JSON.parse(dados);
        console.log(obj);

        divPrevisao.innerHTML = 
            '<div class="row">'
            + '<div class="col" style="font-size: 5em; display: inline;">' + (obj.main.temp).toFixed(1) + 'ºC</div>'
            + '<div class="col">'
                + '<span style="color: var(--cor3); display: inline;">' + parseInt(obj.main.temp_max)+ 'ºC</span><br>'
                + '<span style="color: var(--cor2); display: inline;">' + parseInt(obj.main.temp_min)+ 'ºC</span>'
            + '</div>'
          + '</div>'
          + '<div style="font-size:2em;">' + obj.weather[0].description + '</div><br>'
          + 'Latitude: ' + obj.coord.lat + ' / Longitude: ' + obj.coord.lon + '<br>'
          + 'Aferido em: ' + new Date(obj.dt *1000).toLocaleString() + '<br>'
          + 'Localidade: ' + obj.name + '<br>'
          + 'Humidade: ' + obj.main.humidity + '<br>'
          + 'Visibilidade: ' + (obj.visibility / 100) + '%<br>'
          + 'Vento: ' + obj.wind.speed + 'm/s'
          + '<svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(' + obj.wind.deg + 'deg);" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/></svg></br>';
    }

});
