import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { middlewareFactory } from './middleware/authentication-factory.middleware.js';
import { postRoute } from './route/post.route.js';
import { commentRoute } from './route/comment.route.js';
import { userRoute } from './route/user.route.js';

const server = express();

server.use(express.json());
server.use(morgan('combined'));

//Dung cho toan bo server
server.use(middlewareFactory('x-username'));

server.use('/users', userRoute);
server.use('/posts', postRoute);
server.use('/comments', commentRoute);

mongoose
  .connect('mongodb+srv://duykien85:KfnTVFtEL8uF0FQn@cluster0.gd5vymx.mongodb.net/fullstack')
  .then(() => {
    server.listen(3000, () => {
      console.log('Server running port 3000');
    });
  });
