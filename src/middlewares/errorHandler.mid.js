function errorHandler(err, req, res,) {
    const statusCode = err.statusCode || 500;
    const message = req.method +" "+req.url + "-"+ err.message || 'Internal Server Error';

    return res.status(statusCode).json({message});
}

export default errorHandler;