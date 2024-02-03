import jwt from 'jsonwebtoken';

export const authen = async (req, res, next) => {
  //Xac thuc token
  const token = req.headers?.authorization.split(' ')[1];

  const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
  console.log({ payload });

  //gan user vao request
  req.user = payload;

  next();
};
