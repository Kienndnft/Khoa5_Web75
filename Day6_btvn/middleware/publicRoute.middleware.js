const publicRouteMiddleware = (req, res, next) => {
  req.isPublic = true;
  next();
};

export { publicRouteMiddleware };
