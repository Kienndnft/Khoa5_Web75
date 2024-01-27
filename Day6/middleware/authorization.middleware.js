async function authorizationMiddleware(req, res, next) {
  try {
    if (!req.user.roles || !req.user.roles.includes('admin')) {
      return res.status(401).send({
        data: null,
        message: 'Khong co quyen admin',
        success: false,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      data: null,
      message: 'Server error',
      success: false,
    });
  }
}

export { authorizationMiddleware };
