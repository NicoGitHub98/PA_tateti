const url=require("url");

//Routeador
async function routear(rutas,request,response){
    try{
        const path = url.parse(request.url).pathname;
        const metodoRequest = request.method;
        const ruta = rutas[path];
            if (ruta && ruta.metodo.indexOf(metodoRequest) >= 0) {
                    const promise = new Promise((resolve, reject) => {
                        try {
                            ruta.manejador(request, response)
                            resolve()
                        } catch (error) {
                            reject(error)
                        }
                    });
                    await promise
            } else {
                handle404(request, response)
            }
    }catch (error){
        handle500(request, response, error)
    }
}
//Errores
function handle500(request, response, error){
    response.writeHead(500)
    response.write(`Internal server error : ${error}`)
    response.end()
}
function handle404(request, response) {
    response.writeHead(404)
    response.write(`No se encuentra la ruta: ${url.parse(request.url).pathname}`)
    response.end()
}

exports.routear = routear;
