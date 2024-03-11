import express from 'express';
import { asyncCatch } from '../utils/trycatch.js';
import { authen } from '../../Day8/utils/authen copy.js';
import { getProfile } from '../service/profile.service.js';
// import { getAllUsers, getMe } from '../service/user.service.js';
// import { authen } from '../utils/authen.js';
// import { author } from '../utils/author.js';

const profileController = express.Router();

profileController.get('/', asyncCatch(authen), asyncCatch(getProfile));
profileController.get('/:profileId', asyncCatch(authen), asyncCatch(getProfile));

//BTVN: Hoàn thành CRUD user
// userController.put("/:userId", asyncCatch(authen), asyncCatch(author));
// userController.delete("/:userId", asyncCatch(authen), asyncCatch(author));
// userController.post("/:userId", asyncCatch(authen), asyncCatch(author));
// userController.get("/me", asyncCatch(authen), asyncCatch(getMe));

export { profileController };
