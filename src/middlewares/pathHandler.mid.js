function pathHandler(req, res, next) {
    const message = `${req.method} ${req.url} ENPOINT NOT FOUND`;
    const statusCode = 404;

    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;

   
}

export default pathHandler;