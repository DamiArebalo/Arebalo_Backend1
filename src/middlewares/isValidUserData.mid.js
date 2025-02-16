// Middleware para validar los datos del usuario
function isValidUserData(req, res, next) {
  // recuperar datos del usuario
  const { email, password } = req.body;
  // verificar si los datos son válidos
  if (!email || !password) {
    res.json400("Enter email or password");
  }

  return next();
}

export default isValidUserData;
