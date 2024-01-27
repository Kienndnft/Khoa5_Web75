import { isObjectIdOrHexString } from 'mongoose';
import { UserModel } from '../model/user.model.js';

const validationUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { userId } = req.params;
    console.log(userId);

    //Check truong hop query all, chi cho admin
    if (!userId && req.user.roles.includes('admin')) return next();

    //Check postId co dung dinh dang
    if (!isObjectIdOrHexString(userId)) throw new Error('userId is not valid');

    //Check postId co ton tai
    const current = await UserModel.findById(userId);
    if (!current) throw new Error('userId does not exist');

    // Neu user khong co role hoac khong co role admin thi check userId co phai la nguoi tao user
    if (!req.user.roles || !req.user.roles.includes('admin')) {
      //Check user cua post co trung voi user chinh sua post
      if (userId !== user._id.toString()) throw new Error('userId does not have right');
    }

    next();
  } catch (error) {
    return res.status(403).send({ data: null, message: error.message, success: false });
  }
};

export { validationUser };
