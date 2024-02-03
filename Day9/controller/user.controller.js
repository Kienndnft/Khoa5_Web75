import express from 'express';
import { asyncCatch } from '../utils/trycatch.js';
import { getAllUsers, getMe } from '../service/user.service.js';
import { authen } from '../utils/authen.js';
import { author } from '../utils/author.js';

const userController = express.Router();

userController.get('/', asyncCatch(authen), asyncCatch(author), asyncCatch(getAllUsers));
userController.get('/me', asyncCatch(authen), asyncCatch(getMe));

//BTVN: Hoàn thành CRUD user
// userController.put("/:userId", asyncCatch(authen), asyncCatch(author));
// userController.delete("/:userId", asyncCatch(authen), asyncCatch(author));
// userController.post("/:userId", asyncCatch(authen), asyncCatch(author));
// userController.get("/me", asyncCatch(authen), asyncCatch(getMe));

export { userController };
