const http = require("http");
const router = require("./routeador")
const manejadores = require("./manejadores")
//Variable de historicos que se almacena en el servidor durante la sesion y sus get/set
var historicoGanadas=[];
function getHistoricoGanadas(){
    return {historicoGanadas};
}
function setHistoricoGanadas(data){
    historicoGanadas.push(data);
}
//Creacion del server
const server = http.createServer(function(request, response) {
    var rutas={
        "/":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/tateti.html":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/css/tateti.css":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/css/impact.ttf":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/css/FranklinGothicMediumRegular.ttf":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/favicon.ico":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/tateti.js":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/tatetiUI.js":{
            metodo: "GET",
            manejador: manejadores.rootHandler
        },
        "/pedirHistorico":{
            metodo: "GET",
            manejador: manejadores.historicoHandler
        },
        "/subirData":{
            metodo: "POST",
            manejador: manejadores.subirDataHandler
        }

    }
    router.routear(rutas,request,response);
});

server.listen(8000);
console.log("Servidor Iniciado");

exports.getHistoricoGanadas=getHistoricoGanadas;
exports.setHistoricoGanadas=setHistoricoGanadas;