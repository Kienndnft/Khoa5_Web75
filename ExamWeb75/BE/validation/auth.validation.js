export const validateRegister = (req, res, next) => {
  const { username, password } = req.body;

  //Validate input
  if (!username) throw new Error('username is required');
  if (!password) throw new Error('password is required');

  next();
};
//=======================================
export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  //Validate input
  if (!username) throw new Error('username is required');
  if (!password) throw new Error('password is required');

  next();
};
//=======================================
export const validateRefresh = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new Error('refreshToken is required');
  next();
};
