import { isObjectIdOrHexString } from 'mongoose';
import { PostModel } from '../model/post.model.js';

const validationPost = async (req, res, next) => {
  try {
    const { user } = req;
    const { postId } = req.params;

    //Check truong hop query all, chi cho admin
    if (!postId && req.user.roles.includes('admin')) return next();

    //Check postId co dung dinh dang
    if (!isObjectIdOrHexString(postId)) throw new Error('postId is not valid');

    //Check postId co ton tai
    const currentPost = await PostModel.findById(postId);
    if (!currentPost) throw new Error('postId does not exist');

    // Neu user khong co role hoac khong co role admin thi check userId co phai la nguoi tao post/comments
    if (!req.user.roles || !req.user.roles.includes('admin')) {
      //Check user cua post co trung voi user chinh sua post
      if (currentPost.userId !== user._id.toString()) throw new Error('userId does not have right');
    }

    next();
  } catch (error) {
    return res.status(403).send({ data: null, message: error.message, success: false });
  }
};

export { validationPost };
