// Función para manejar errores
function errorHandler(err, req, res, next) {
    // Obtener el código de estado y el mensaje de error
    const statusCode = err.statusCode || 500;
    // Obtener el mensaje de error
    const message = `${req.method} ${req.url} - ${err.message || 'Internal Server Error'}`;
    // Enviar el mensaje de error al cliente
    console.error(message);

    // si el mensaje de error no se envió al cliente, enviarlo
    if (res.headersSent) {
      return next(err);
    }
    // Enviar el código de estado y el mensaje de error al cliente
    res.status(statusCode).json({ message });
  }
  
  export default errorHandler;