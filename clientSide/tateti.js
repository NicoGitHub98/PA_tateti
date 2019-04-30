var playerActual=1; //EL PLAYER INICIAL ES POR DEFECTO EL 1
var celdas=[0,0,0,0,0,0,0,0,0]; //INICIALIZO LAS CELDAS TODAS VACIAS, ES DECIR, SIN MARCAR
var historicoJugadasServidor={};
var permitirJugada=true;

function comenzarJuego(){
    document.getElementById("mostrarHistorico").addEventListener("click",mostrarHistorico,false);
    document.getElementById("closebtn").addEventListener("click",ocultarHistorico,false);
    document.getElementById("actualizarHistorico").addEventListener("click",mostrarHistorico,false);
    //Detecto los 8 canvas y los pongo a la escucha de "click"
    listaCanvas=document.getElementsByTagName("canvas");
    for(let i=0;i<listaCanvas.length;i++){
        listaCanvas[i].addEventListener("click",llamadaValidar=function(e){validar(e,i);},false);
    }
    //Pongo al boton del banner(inicialmente oculto) a la escucha de "click" para iniciar otro juego
    document.getElementById("botonContinuar").addEventListener("click",jugarDeNuevo,false);
}

//Esta funcion chequea si la celda esta marcada anteriormente por el otro jugador, en caso de que si, alerta y no hace nada; en caso de que no, llama a tickear()
function validar(e,indice){
    if(celdas[indice]==0 && permitirJugada){
        celdas[indice]=playerActual;
        tickear(e);
        haGanado();
    }
    else if(celdas[indice]!=0 && permitirJugada){
        alert("El player anterior ya marco esa posicion");
    }
}

//Esta funcion chequea si alguien ha ganado, y se llama luego de cada tickeo
function haGanado(){
    //Crea un objeto de partida terminada
    var partidaTerminada={
        estadoPartida: [],
        playerGanador: 0
    };
    //TODAS ESTAS SON LAS COMBINACIONES DE CELDAS MARCADAS PARA GANAR, HORIZONTALES, VERTICALES Y DIAGONALES, Y segun cual es la conmbinacion, se le asigna un numero de jugadaGanadora
    var jugadaGanadora=0;
    //SI HAY 3 EN FILA ENTRA
    if((celdas[0]==playerActual && celdas[1]==playerActual && celdas[2]==playerActual && (jugadaGanadora=1))
    ||(celdas[3]==playerActual && celdas[4]==playerActual && celdas[5]==playerActual && (jugadaGanadora=2))
    ||(celdas[6]==playerActual && celdas[7]==playerActual && celdas[8]==playerActual && (jugadaGanadora=3))
    ||(celdas[0]==playerActual && celdas[3]==playerActual && celdas[6]==playerActual && (jugadaGanadora=4))
    ||(celdas[1]==playerActual && celdas[4]==playerActual && celdas[7]==playerActual && (jugadaGanadora=5))
    ||(celdas[2]==playerActual && celdas[5]==playerActual && celdas[8]==playerActual && (jugadaGanadora=6))
    ||(celdas[0]==playerActual && celdas[4]==playerActual && celdas[8]==playerActual && (jugadaGanadora=7))
    ||(celdas[2]==playerActual && celdas[4]==playerActual && celdas[6]==playerActual && (jugadaGanadora=8))){
        //Seteo bandera para no dibujar ni marcar celdas
        permitirJugada=false;
        //LLAMADA A FUNCION QUE REMARCA LAS CELDAS GANADORAS
        remarcarCeldas(jugadaGanadora);
        //Seteo el objeto de partida terminada
        for(let j=0;j<celdas.length;j++){
            partidaTerminada.estadoPartida.push(celdas[j]);
        }
        if(playerActual===1)
            partidaTerminada.playerGanador=playerActual;
        else partidaTerminada.playerGanador=playerActual;
        avisarResultadoServer(partidaTerminada);
    }
    //SI NO HAY 3 EN FILA, CHEQUEA SI ESTAN TODAS LAS FILAS OCUPADAS, ES DECIR, CHEQUEA EMPATE
    else if(celdas.every(function(valorCelda){return valorCelda!=0;})){
        empate();
        partidaTerminada.playerGanador=0;
        for(let j=0;j<celdas.length;j++){
            partidaTerminada.estadoPartida.push(celdas[j]);
        }
        avisarResultadoServer(partidaTerminada);
    }
    //SI NO HAY EMPATE, CAMBIA DE JUGADOR, CORRESPONDIENTEMENTE
    else{
        if(playerActual==1){
            playerActual=2;
            document.getElementById("avisos").innerHTML="Juega Player 2";
        }
        else{
            playerActual=1;
            document.getElementById("avisos").innerHTML="Juega Player 1";
        }
    }
}

function jugarDeNuevo(){
    var eleccionJugarDeNuevo=confirm("¿Quieres resetear el Juego?");
    if(eleccionJugarDeNuevo){
        /* if(playerActual==1)
            playerActual=2; */
        celdas=[0,0,0,0,0,0,0,0,0];
        permitirJugada=true;
    }
    resetearUI(eleccionJugarDeNuevo);
    pedirHistorico();
}

function avisarResultadoServer(JSONPlayerGanador){
    var data = JSON.stringify(JSONPlayerGanador);
    xhr = new XMLHttpRequest();
    var urlServer = "/subirData";
    xhr.open("POST", urlServer, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}
//Obtengo la respuesta del servidor sobre el historico de jugadas
function pedirHistorico(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/pedirHistorico",true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            historicoJugadasServidor=JSON.parse(xhr.responseText);    
        }
    }
}
window.addEventListener("load", comenzarJuego,false);