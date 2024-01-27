import { UserModel } from '../model/user.model.js';

async function authenticationMiddleware(req, res, next) {
  try {
    const username = req.headers?.['x-username'];

    //Dung ham cua userModel de kiem tra username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).send({
        data: null,
        message: 'Xác thực không thành công',
        success: false,
      });
    }

    //Chèn user vao request cho middleware tiep theo
    req.user = user;
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

export { authenticationMiddleware };
