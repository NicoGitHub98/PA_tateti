const url= require("url");
const fs=require("fs");
const servidor=require("./servidorTateti");

//Manejadores
function rootHandler(request, response){
    var pathname = url.parse(request.url).pathname;
    if (pathname === "/"){
        pathname = "/tateti.html";
    }
    fs.readFile("./../clientSide"+pathname,(error,readedFile)=>{
        try{
            if(pathname.indexOf(".js")>0) {
                response.writeHeader(200, {"Content-Type": "application/js"});  
            } else if (pathname.indexOf(".css")>0){
                response.writeHeader(200, {"Content-Type": "text/css"});  
            } else if (pathname.indexOf(".html")>0){
                response.writeHeader(200, {"Content-Type": "text/html"});
            } else if (pathname.indexOf(".ico")>0){
                response.writeHeader(200, {"Content-Type": "image/x-icon"});
            } 
            response.write(readedFile);
            response.end();
        }catch(error){
            console.log("Se produjo un error con los archivos en el servidor: "+error.toString());
        }
    });
}
function historicoHandler(request, response){
    response.writeHeader(200,{"Content-Type": "text/plain"});
    response.write(JSON.stringify(servidor.getHistoricoGanadas()));
    response.end();
}
function subirDataHandler(request,response){
    var dataRecibida = "";
    request.on("data", (chunk) => {
    dataRecibida += chunk.toString();
    });
    request.on('end', () => {
        parsedJSONdata=JSON.parse(dataRecibida);
        servidor.setHistoricoGanadas(parsedJSONdata);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end();
    });
}

exports.rootHandler=rootHandler;
exports.historicoHandler=historicoHandler;
exports.subirDataHandler=subirDataHandler;
