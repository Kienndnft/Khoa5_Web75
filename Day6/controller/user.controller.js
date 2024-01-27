import express from 'express';
import { UserModel } from '../model/user.model.js';

const userController = express.Router();

//===============================
//GET ALL
userController.get('/', async (req, res) => {
  try {
    const query = req.query;
    const users = await UserModel.find(query);
    res.status(200).send({ data: users, message: 'Get users', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//===============================
userController.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Validate input
    if (!username) throw new Error('userName is required');
    if (!email) throw new Error('email is required');
    if (!password) throw new Error('password is required');

    //Check trùng userName, findOne tra ve null neu khong co du lieu,
    const valid = await UserModel.findOne({ username });
    if (valid) throw new Error('username already exists');

    //Tao moi user tren mongodb
    const newItem = await UserModel.create({
      username,
      email,
      password,
      roles: ['user'],
    });

    res.status(200).send({ data: newItem, message: 'Register user successful!', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================

export { userController };
