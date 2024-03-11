import jwt from 'jsonwebtoken';

export const authen = async (req, res, next) => {
  //Xac thuc token

  if (!req.headers?.authorization) throw new Error('Authentication failed');
  console.log(req.headers?.authorization);

  const token = req.headers?.authorization.split(' ')[1];

  const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
  if (!payload) throw new Error('Authentication failed');

  //gan user vao request
  req.user = payload;

  next();
};
