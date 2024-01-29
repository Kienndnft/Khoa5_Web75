import { isObjectIdOrHexString } from 'mongoose';
import { PostModel } from '../model/post.model.js';
import Joi from 'joi';
import { UserModel } from '../model/user.model.js';

//================================
export const validationIsAdmin = (req, res, next) => {
  try {
    if (!req.isAdmin)
      return res
        .status(403)
        .send({ data: null, message: 'Insufficient permissions', success: false });

    next();
  } catch (error) {
    return res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//================================
export const validationPost = async (req, res, next) => {
  try {
    const { user, isAdmin } = req;
    const { postId } = req.params;

    //Check Id co hop le
    if (!isObjectIdOrHexString(postId)) throw new Error('Id is not valid');

    //Check postId co ton tai
    const current = await PostModel.findById(postId);
    if (!current) throw new Error('postId does not exist');

    // Neu user khong phai admin va userId khong phai la nguoi tao post/comments
    if (!isAdmin && current.userId !== user._id.toString())
      throw new Error('Insufficient permissions userId');

    next();
  } catch (error) {
    return res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//================================
export const validationBodyPost = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object({
    content: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({ data: null, message: error.details[0].message, success: false });
  }

  next();
};
//================================
export const validationBodyUser = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({ data: null, message: error.details[0].message, success: false });
  }

  next();
};
//================================
export const validationUser = async (req, res, next) => {
  try {
    const { user, isAdmin } = req;
    const { userId } = req.params;

    //Check postId co dung dinh dang
    if (!isObjectIdOrHexString(userId)) throw new Error('Id is not valid');

    // Neu user khong phai admin va userId khong phai la nguoi tao user
    if (userId !== user._id.toString()) {
      if (!isAdmin) throw new Error('Insufficient permissions userId'); //Neu khong phai la admin thi bao loi

      const current = await UserModel.findById(userId);
      if (!current) throw new Error('userId does not exist');
    }
    next();
  } catch (error) {
    return res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//================================
export const validationPasswordUser = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object({
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({ data: null, message: error.details[0].message, success: false });
  }

  next();
};
//================================
