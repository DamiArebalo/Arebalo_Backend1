function pathHandler(req, res, next) {
    const message = `${req.method} ${req.url} ENPOINT NOT FOUND`;
    const statusCode = 404;

    return res.status(statusCode).json({
        message,
        statusCode
    });
}

export default pathHandler;