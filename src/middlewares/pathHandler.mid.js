// Middleware para manejar errores de ruta
function pathHandler(req, res, next) {
    try {
        const message = `${req.method} ${req.url} ENPOINT NOT FOUND`;
        const statusCode = 404;

        const error = new Error(message);
        error.statusCode = statusCode;
        throw error;
        
    } catch (error) {
        return next(error);
    }
   
}

export default pathHandler;