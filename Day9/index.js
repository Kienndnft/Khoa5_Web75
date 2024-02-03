import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { userController } from './controller/user.controller.js';
import { authController } from './controller/auth.controller.js';
import { asyncCatch } from './utils/trycatch.js';
import { authen } from './utils/authen.js';

//reads the contents of the .env file in the root of your project and loads the variables into process.env
dotenv.config();

const server = express();

server.use(express.json());
server.use(morgan('combined'));

server.use('/users', userController);
server.use('/auth', authController);

server.use('/index', (req, res, next) => {
  res.status(200).send('Hello world');
});

mongoose.connect(`${process.env.MONGO_CONNECT}/fullstack`).then(() => {
  server.listen(process.env.PORT, () => {
    console.log('Server running...');
  });
});
