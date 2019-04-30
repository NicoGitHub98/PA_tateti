//Esta funcion se encarga de dibujar los circulos o equis, pasando como parametro el cavas en el cual hacerlo
function tickear(e){
    var canvasCelda=e.target;
    if(playerActual==1){
        canvasCelda.hastaCircunferencia=0;
        canvasCelda.intervaloLlamadaCirculo=setInterval(function(){
            dibujarCirculoSmoothly(canvasCelda);
        },1000/360);
    }else{
        canvasCelda.posicionEnX=0;
        canvasCelda.posicionEnY=0;
        canvasCelda.intervaloLlamadaEquis=setInterval(function(){
            dibujarEquisSmoothly(canvasCelda);
        },25);
    }
}
//Estas Funciones se encargan de la animacion al dibujar las "X" o los "O"
function dibujarCirculoSmoothly(canvasCelda){
    canvasCelda.width=canvasCelda.width;
    lienzoCelda=canvasCelda.getContext("2d");
    lienzoCelda.strokeStyle="#000000";
    lienzoCelda.lineWidth=10;
    lienzoCelda.beginPath();
    lienzoCelda.arc(canvasCelda.width/2,canvasCelda.height/2,45,0,canvasCelda.hastaCircunferencia*Math.PI/180,false);
    lienzoCelda.stroke();
    lienzoCelda.closePath();
    canvasCelda.hastaCircunferencia+=4;
    if(canvasCelda.hastaCircunferencia>360)
        clearInterval(canvasCelda.intervaloLlamadaCirculo);
}
function dibujarEquisSmoothly(canvasCelda){
    canvasCelda.width=canvasCelda.width;
    lienzoCelda=canvasCelda.getContext("2d");
    lienzoCelda.strokeStyle="#000000";
    lienzoCelda.lineWidth=10;
    lienzoCelda.beginPath();
    canvasCelda.posicionEnX+=10;
    canvasCelda.posicionEnY+=10;
    lienzoCelda.moveTo(0,0);
    lienzoCelda.lineTo(canvasCelda.posicionEnX,canvasCelda.posicionEnY);
    lienzoCelda.moveTo(100,0);
    lienzoCelda.lineTo(100-canvasCelda.posicionEnX,canvasCelda.posicionEnY);
    lienzoCelda.stroke();
    if(canvasCelda.posicionEnX>100)
        clearInterval(canvasCelda.intervaloLlamadaEquis);
}

//Esta funcion remarca las celdas ganadoras
function remarcarCeldas(jugadaGanadora){
    //Espera 1 segundo para mostrar la pantalla Final
    setTimeout(function(){
        document.getElementById("banner").style.visibility="visible";
        document.getElementById("botonContinuar").style.visibility="visible";
        document.getElementById("textoFin").innerHTML="HA GANADO EL PLAYER: "+playerActual+"<br>";
    },1000);
    if(jugadaGanadora<4){//SI LAS JUGADAS GANADORAS SON LAS FILAS HORIZONTALES:
        for(let i=1;i<4;i++){
            document.getElementById("celda"+(i+((jugadaGanadora-1)*3))).style.animation="fadein 1.5s";
            document.getElementById("celda"+(i+((jugadaGanadora-1)*3))).style.animationFillMode="forwards";
        }
    }
    else if(jugadaGanadora<7){//SI SON LAS VERTICALES:
        for(let i=0;i<3;i++){
            let aux1=(jugadaGanadora-1)%3;
            document.getElementById("celda"+((aux1+1)+(i*3))).style.animation="fadein 1.5s";
            document.getElementById("celda"+((aux1+1)+(i*3))).style.animationFillMode="forwards";
        }
    }
    else if(jugadaGanadora==7){//SI ES UNA DE LAS DIAGONALES:
        for(let i=0;i<3;i++){
            document.getElementById("celda"+((i*4)+1)).style.animation="fadein 1.5s";
            document.getElementById("celda"+((i*4)+1)).style.animationFillMode="forwards";
        }
    }
    else if(jugadaGanadora==8){//SI ES LA OTRA DIAGONAL:
        for(let i=0;i<3;i++){
            document.getElementById("celda"+((i*2)+3)).style.animation="fadein 1.5s";
            document.getElementById("celda"+((i*2)+3)).style.animationFillMode="forwards";
        }
    }
}
function empate(){
    document.getElementById("banner").style.visibility="visible";
    document.getElementById("botonContinuar").style.visibility="visible";
    document.getElementById("textoFin").innerHTML="HA HABIDO UN EMPATE<br>";
}
function resetearUI(eleccionJugarDeNuevo){
    if(eleccionJugarDeNuevo){
        for(let i=0;i<listaCanvas.length;i++){
            listaCanvas[i].width=listaCanvas[i].width;
        }
        var listaCeldas=document.querySelectorAll("div[id^='celda']");
        for(let i=0;i<listaCeldas.length;i++){
            listaCeldas[i].style.removeProperty("animation");
            listaCeldas[i].style.removeProperty("animationFillMode");
        }
        document.getElementById("banner").style.visibility="hidden";
        document.getElementById("botonContinuar").style.visibility="hidden";
        document.getElementById("mostrarHistorico").style.visibility="visible";
    }
    else{
        document.getElementById("banner").style.visibility="hidden";
        document.getElementById("botonContinuar").style.visibility="hidden";
        document.getElementById("avisos").style.visibility="hidden";
        var mensaje=document.getElementById("contenedor");
        mensaje.innerHTML="Ha terminado el juego, el ganador es el player: "+playerActual+"<br><button id='botonArrepentido'>Me arrepentí, jugar de nuevo</button>";
        document.getElementById("botonArrepentido").addEventListener("click",function(){window.location.reload();},false);
    }
}
function mostrarHistorico(){
    document.getElementById("mostrarHistorico").disabled=true;
    document.getElementById("actualizarHistorico").style.display="block";
    document.getElementById("panelLateral").style.backgroundColor="#1f1f1f";
    document.getElementById("panelLateral").style.width="250px";
    document.getElementById("closebtn").style.visibility="visible";
    var divHistorico=document.getElementById("divHistorico");
    var textoHistorico="";
    var dibujoTateti="";
    for(let i=0;i<historicoJugadasServidor.historicoGanadas.length;i++){
        dibujoTateti=dibujarTatetiCaracteres(i);
        if(historicoJugadasServidor.historicoGanadas[i].playerGanador!==0){
            textoHistorico+="Partida N°"+(i+1)+":<br>-Ganador:  Player "+historicoJugadasServidor.historicoGanadas[i].playerGanador+"<br>-Estado Final:<br><span>"+dibujoTateti+"</span>";
        }
        else{
            textoHistorico+="Partida N°"+(i+1)+":<br>Empate<br>Estado Final:<br><span>"+dibujoTateti+"</span>";
        }
    }
    setTimeout(function(){divHistorico.innerHTML=textoHistorico;},200);

}
function ocultarHistorico(){
    document.getElementById("actualizarHistorico").style.display="none";
    document.getElementById("mostrarHistorico").disabled=false;
    document.getElementById("panelLateral").style.backgroundColor="#FFFFFF";
    document.getElementById("panelLateral").style.width="0%";
    document.getElementById("closebtn").style.visibility="hidden";
    var divHistorico=document.getElementById("divHistorico");
    divHistorico.innerText="";
}
function dibujarTatetiCaracteres(i){
    var dibujoTateti="";
    for(let j=0;j<historicoJugadasServidor.historicoGanadas[i].estadoPartida.length;j++){
        if(j==2 || j==5){
            dibujoTateti+=cambiarNumerosSimbolos(historicoJugadasServidor.historicoGanadas[i].estadoPartida[j])+"<br>-----<br>"
        }
        else if(j==8){
            dibujoTateti+=cambiarNumerosSimbolos(historicoJugadasServidor.historicoGanadas[i].estadoPartida[j])+"<br><br>"
        }
        else{
            dibujoTateti+=cambiarNumerosSimbolos(historicoJugadasServidor.historicoGanadas[i].estadoPartida[j])+"|"
        }
    }
    return dibujoTateti;
}
function cambiarNumerosSimbolos(numero){
    if(numero==1)
    return "O";
    else if (numero==2)
    return "X";
    else return "&nbsp;";
}