function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = `${req.method} ${req.url} - ${err.message || 'Internal Server Error'}`;
    console.error(message);
    
    if (res.headersSent) {
      return next(err);
    }
    
    res.status(statusCode).json({ message });
  }
  
  export default errorHandler;