const authorizationMiddleware = async (req, res, next) => {
  try {
    if (req.user.roles.includes('admin')) {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
    }

    next();
  } catch (error) {
    res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

export { authorizationMiddleware };
