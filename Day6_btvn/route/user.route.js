import express from 'express';
import {
  getUsers,
  getUserId,
  createUser,
  updateUserId,
  deleteUserId,
} from '../controller/user.controller.js';
import {
  validationBodyUser,
  validationIsAdmin,
  validationLoginUser,
  validationPasswordUser,
  validationUser,
} from '../middleware/validation.js';

const userRoute = express.Router();
//const userPublicRoute = express.Router();

//Tao user moi
userRoute.post('/', validationBodyUser, createUser);

//Login
//userPublicRoute.post('/', validationLoginUser, createUser);

//Admin only
userRoute.get('/', validationIsAdmin, getUsers);

//User & admin
userRoute.get('/:userId', validationUser, getUserId);
userRoute.put('/:userId', validationUser, validationPasswordUser, updateUserId); //chi thay doi thong tin password
userRoute.delete('/:userId', validationUser, deleteUserId);

export { userRoute };
