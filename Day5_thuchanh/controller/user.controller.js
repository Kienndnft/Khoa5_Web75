import express from 'express';
import { userModel } from '../model/user.model.js';
import { isObjectIdOrHexString } from 'mongoose';

const userController = express.Router();

//GET ALL
userController.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    const users = await userModel.find({ query });
    res.status(200).send({ data: users, message: 'Get users', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//GET ONE
userController.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    //Validate id user
    if (!isObjectIdOrHexString(userId)) throw new Error('ID is not valid');

    const users = await userModel.findById(userId);
    res.status(200).send({ data: users, message: 'Get user', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//1. Viết API việc đăng ký user với userName
userController.post('/', async (req, res) => {
  try {
    const { userName, email } = req.body;

    //Validate input
    if (!userName) throw new Error('userName is required');
    if (!email) throw new Error('email is required');

    //Check trùng userName, findOne tra ve null neu khong co du lieu,
    const validUserName = await userModel.findOne({ userName });
    if (validUserName) throw new Error('userName already exists');

    //Tao moi user tren mongodb
    const newItem = await userModel.create({
      userName,
      email,
    });

    res.status(200).send({ data: newItem, message: 'Register successful!', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { userController };
