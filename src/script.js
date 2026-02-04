function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function deleteCookie(cname) {
    let expires = "expires=Thu, 18 Dec 2013 12:00:00 UTC";
    document.cookie = cname + "=;" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.addEventListener("DOMContentLoaded", function() {
    const divAlerta = document.getElementById("divAlerta");

    const estados = document.getElementById("estados");
    const municipios = document.getElementById("municipios");
    const divOutraPrevisao = document.getElementById("divOutraPrevisao");

    function CarregaEstados() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(result) {
            let obj = JSON.parse(result.target.response);
            document.getElementById("estados").innerHTML ="<option value='0'>SELECIONE O ESTADO</option>";
            for(x=0; x < obj.length; x++){
                estados.innerHTML +="<option value='" + obj[x].sigla + "'>" + obj[x].nome + " (" + obj[x].sigla + ")</option>";
            }
        });
        xhr.open("GET", "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        xhr.send();
    }
    estados.addEventListener("change", function(e) {
        CarregaMunicipios(e.target.value)
    });

    function CarregaMunicipios(estado) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function(result) {
            let obj = JSON.parse(result.target.response);
            document.getElementById("municipios").innerHTML ="<option value='0'>SELECIONE O MUNICÍPIO</option>";
            for(x=0; x < obj.length; x++){
                document.getElementById("municipios").innerHTML +="<option value='" + obj[x].nome + "'>" + obj[x].nome + "</option>";
            }
        });
        xhr.open("GET", "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + estado + "/municipios");
        xhr.send();
    }
    municipios.addEventListener("change", function(e) {
        let municipio = e.target.value;
        
        var param1 = '?q=' + municipio;
        if(param1 == '?q=') return;

        var url = baseurl + api + param1 + param2;

        xhr = new XMLHttpRequest();
        xhr.addEventListener("loadend", function(e) {
            MostrarOutrosDadosGEO(e.srcElement.response);
        });

        xhr.open("GET", url);
        xhr.send();
    });

    function MostrarOutrosDadosGEO(dados) {
        var obj = JSON.parse(dados);

        console.log(obj);

        divOutraPrevisao.innerHTML = 
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


    CarregaEstados();
});



    // // críticas para que funcione
    // if (navigator.connection.effectiveType == null) {
    //     speStatus.innerHTML = "sem internet";
    // } else if (!navigator.geolocation) {
    //     geoStatus.innerHTML = "sem Geolocalização";
    // } else if (!'speechSynthesis' in window) {
    //     speStatus.innerHTML = "sem fala";
    // } else if (!'speechRecognition' in window && !'webkitSpeechRecognition' in window)  {
    //     recStatus.innerHTML = "sem reconhecimento de fala";
    // } else {
    //     // efeito sonoro de ligação telefônica
    //     var som = document.getElementById("calling");

    //     // botões do celular
    //     document.getElementById('ligar').addEventListener('click', function() {
    //         desligado = false;
    //         // speStatus.innerHTML = "discando";
    //         document.getElementById("ligar").style.visibility = "hidden";
    //         document.getElementById("desligar").style.right = "37%";

    //         som.play();

    //         $.getJSON('https://json.geoiplookup.io/?callback=?', function(data) {
    //             origem = data.district;
                
    //  // geoStatus.innerHTML = origem;
    //         });

    //         setTimeout(function() {
    //             som.pause();
    //             Inicio();
    //         }, 12000);
    //     });

    //     document.getElementById('desligar').addEventListener('click', function() {
    //         desligado = true;
    //         speStatus.innerHTML = "";
    //         document.getElementById("ligar").style.visibility = "visible";
    //         document.getElementById("desligar").style.right = "10%";

    //         som.pause();
    //         window.speechSynthesis.cancel();
    //         navigator.geolocation.clearWatch(geoId);
    //     });

    //     document.getElementById("proximaEtapa").addEventListener("click", function() {
    //         if(!desligado) {
    //             if(etapa == null) { Inicio(); }
    //             else if(etapa == -1) { Participantes(); }
    //             else if(etapa == 0) { Etapa1(); }
    //             else if(etapa == 1) { Etapa2(); }
    //             else if(etapa == 2) { Etapa3(); }
    //             else if(etapa == 3) { Etapa4(); }
    //             else if(etapa == 4) { Etapa5(); }
    //             else if(etapa == 5) { Etapa6(); }
    //         }
    //     })
    // }


