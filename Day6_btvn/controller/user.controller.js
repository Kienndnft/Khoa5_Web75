import { UserModel } from '../model/user.model.js';
import bcrypt from 'bcrypt';

//=========================================
export const getUsers = async (req, res) => {
  const { query } = req.query;
  const users = await UserModel.find({ query });
  res.status(200).send({ data: users, message: 'Get users', success: true });
};
//=========================================
export const getUserId = async (req, res) => {
  const { userId } = req.params;
  const current = await UserModel.findById(userId);
  res.status(200).send({ data: current, message: 'Get userId', success: true });
};
//=========================================
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check trùng userName, findOne tra ve null neu khong co du lieu,
    const valid = await UserModel.findOne({ username });
    if (valid) throw new Error('username already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashesPassword = await bcrypt.hash(password, salt);

    //Tao moi user tren mongodb
    const newUser = await UserModel.create({
      username,
      email,
      password: hashesPassword,
      roles: ['user'],
    });

    res.status(201).send({ data: newUser, message: 'Register user successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//=========================================
export const updateUserId = async (req, res) => {
  try {
    const { password } = req.body;
    const { userId } = req.params;

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashesPassword = await bcrypt.hash(password, salt);

    //update password user
    await UserModel.findByIdAndUpdate(userId, { password: hashesPassword }, { new: true });

    res.status(201).send({ data: null, message: 'Updated password successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//=========================================
export const deleteUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    //update password user
    await UserModel.findByIdAndDelete(userId);

    res.status(204).send('');
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//=========================================
