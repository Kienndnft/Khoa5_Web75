import express from 'express';
import { asyncCatch } from '../utils/trycatch.js';
import { getMe } from '../service/user.service.js';
import { login, refresh, register } from '../service/auth.service.js';
import { validateLogin, validateRefresh, validateRegister } from '../validation/auth.validation.js';

const authController = express.Router();

authController.post('/register', asyncCatch(validateRegister), asyncCatch(register));
authController.post('/login', asyncCatch(validateLogin), asyncCatch(login));
authController.post('/refresh', asyncCatch(validateRefresh), asyncCatch(refresh));

export { authController };
