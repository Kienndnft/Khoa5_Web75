import express from 'express';
import { validationUser } from '../middleware/user.validation.js';
import { getUsers, getUserId } from '../controller/user.controller.js';

const userRoute = express.Router();

userRoute.get('/', validationUser, getUsers);
userRoute.get('/:userId', validationUser, getUserId);
userRoute.post('/', getUsers);
userRoute.put('/:postId', validationUser, getUsers);
userRoute.delete('/:postId', validationUser, getUsers);

export { userRoute };
