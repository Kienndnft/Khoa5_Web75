import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { userController } from './controller/user.controller.js';
import { authenticationMiddleware } from './middleware/authentication.middleware.js';
import { authenticationAdmin } from './middleware/authentication-admin.mindx.js';
import { postController } from './controller/post.controller.js';
import { middlewareFactory } from './middleware/authentication-factory.middleware.js';
import { authorizationMiddleware } from './middleware/authorization.middleware.js';
import { commentController } from './controller/comment.controller.js';

const server = express();

server.use(express.json());
server.use(morgan('combined'));

//Dung cho toan bo server
//server.use(authenticationMiddleware);

server.use('/users', userController);
server.use('/posts', postController);
server.use('/comments', commentController);

//private route
//server.use('/users', userController);
//server.use('/users', authenticationMiddleware, userController);
//server.use('/users', middlewareFactory('x-username'), authorizationMiddleware, userController);
//server.use('/posts', middlewareFactory('x-username'), middlewareFactory('x-admin'), postController);

//public route
server.use('/index', (req, res) => res.status(200).send('Welcome to Mindx'));

mongoose
  .connect('mongodb+srv://duykien85:KfnTVFtEL8uF0FQn@cluster0.gd5vymx.mongodb.net/fullstack')
  .then(() => {
    server.listen(3000, () => {
      console.log('Server running port 3000');
    });
  });
