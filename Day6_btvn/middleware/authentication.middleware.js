import { UserModel } from '../model/user.model.js';

const authenticationMiddleware = async (req, res, next) => {
  try {
    if (req?.isPublic) return next();

    const username = req.headers?.['x-username'];

    if (username) {
      const user = await UserModel.findOne({ username });

      if (!user) {
        return res.status(500).send({
          data: null,
          message: 'Authentication failed',
          success: false,
        });
      }

      req.user = user;
      next();
    } else {
      return res.status(500).send({
        data: null,
        message: 'Missing "x-username"',
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

export { authenticationMiddleware };
