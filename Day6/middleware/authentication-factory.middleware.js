import { UserModel } from '../model/user.model.js';

const middlewareFactory = (headerName) => {
  return async function (req, res, next) {
    const header = req.headers?.[headerName];
    if (headerName === 'x-username') {
      try {
        //Kiem tra user co trong database khong
        const user = await UserModel.findOne({ username: header });

        if (!user) {
          return res.status(403).send({
            data: null,
            message: 'Xác thực không thành công',
            success: false,
          });
        }
        //Chèn user vao request cho middleware tiep theo,
        req.user = user;

        return next();
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          data: null,
          message: 'Server error',
          success: false,
        });
      }
    }

    if (headerName === 'x-admin') {
      try {
        if (!header || header !== 'admin') {
          return res.status(403).send({
            data: null,
            message: 'Not admin',
            success: false,
          });
        }

        return next();
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          data: null,
          message: 'Server error',
          success: false,
        });
      }
    }
    next();
  };
};

export { middlewareFactory };
