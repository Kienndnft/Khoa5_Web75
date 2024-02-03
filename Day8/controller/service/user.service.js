import { UserModel } from '../model/user.model.js';

export const getMe = async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
  res.status(200).send(user);
};

export const getAllUsers = async (req, res, next) => {
  const users = await UserModel.find({});
  res.status(200).send(users);
};
