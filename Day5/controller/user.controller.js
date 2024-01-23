import express from 'express';
import { UserModel } from '../../Day5/model/user.model.js';
import { isObjectIdOrHexString } from 'mongoose';

const userController = express.Router();

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

//GET ONE
userController.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    //Validate userId
    if (!isObjectIdOrHexString(userId)) throw new Error('userId is not valid');

    const user = await UserModel.findById(userId);

    res.status(200).send({ data: user, message: 'Get user', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

userController.post('/', async (req, res) => {
  try {
    const { userName, email, age, avatar } = req.body;

    //Validate input
    if (!userName) throw new Error('userName is required');
    if (!email) throw new Error('email is required');
    if (!age) throw new Error('age is required');
    if (!avatar) throw new Error('avatar is required');

    //Check trùng userName, findOne tra ve null neu khong co du lieu,
    const validUserName = await UserModel.findOne({ userName });
    if (validUserName) throw new Error('userName already exists');

    //Tao moi user tren mongodb
    const newItem = await UserModel.create({
      userName,
      email,
      age,
      avatar,
    });

    res.status(200).send({ data: newItem, message: 'Register user successful!', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

userController.put('/:userId', async (req, res) => {
  try {
    const { userName } = req.body;
    const { userId } = req.params;

    //Validate input
    if (!userName) throw new Error('userName is required');
    if (!isObjectIdOrHexString(userId)) throw new Error('userId is not valid');

    //Check userId co ton tai
    const current = await UserModel.findById(userId);
    if (!current) throw new Error('userId does not exist');

    //Check userName dang so huu
    if (current.userName !== userName) throw new Error('userName does not have right');

    //update post
    const updateItem = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });

    res.status(201).send({ data: updateItem, message: 'User updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

userController.delete('/:userId', async (req, res) => {
  try {
    const { userName } = req.body;
    const { userId } = req.params;

    //Validate input
    if (!userName) throw new Error('userName is required');
    if (!isObjectIdOrHexString(userId)) throw new Error('userId is not valid');

    //Check userId co ton tai
    const current = await UserModel.findById(userId);
    if (!current) throw new Error('userId does not exist');

    //Check userName dang so huu
    if (current.userName !== userName) throw new Error('userName does not have right');

    //delete post
    await UserModel.findByIdAndDelete(userId);

    res.status(204).send('');
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { userController };
