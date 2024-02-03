export const author = async (req, res, next) => {
  if (!req.user.roles?.includes('admin')) throw new Error('Need admin role');
  next();
};
