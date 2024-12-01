function isValidUserData(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json400("Enter email & password");
  }
  return next();
}

export default isValidUserData;
