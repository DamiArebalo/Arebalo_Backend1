function newError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export default newError;
