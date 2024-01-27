import { isObjectIdOrHexString } from 'mongoose';
import { CommentModel } from '../model/comments.model.js';

const validationComment = async (req, res, next) => {
  try {
    const { user } = req;
    const { commentId } = req.params;

    //Check truong hop query all, chi cho admin
    if (!commentId && req.user.roles.includes('admin')) return next();

    //Check commentId co dung dinh dang
    if (!isObjectIdOrHexString(commentId)) throw new Error('commentId is not valid');

    //Check commentId co ton tai
    const current = await CommentModel.findById(commentId);
    if (!current) throw new Error('commentId does not exist');

    // Neu user khong co role hoac khong co role admin thi check userId co phai la nguoi tao post/comments
    if (!req.user.roles || !req.user.roles.includes('admin')) {
      //Check user cua post co trung voi user chinh sua post
      if (current.userId !== user._id.toString()) throw new Error('userId does not have right');
    }

    next();
  } catch (error) {
    return res.status(403).send({ data: null, message: error.message, success: false });
  }
};

export { validationComment };
