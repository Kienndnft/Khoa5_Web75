import express from 'express';
import mongoose from 'mongoose';
import { postController } from './controller/post.controller.js';
import { userController } from './controller/user.controller.js';

const server = express();

//Cach 1:
server.use(express.json());

// //Cach 3 cua mdiddleware
// function testMiddleware(req, res, next) {
//   try {
//     console.log('Test Middleware');
//     next();
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// }

// server.use(testMiddleware);

//Cach 2:
server.use('/posts', postController);
server.use('/users', userController);

mongoose
  .connect('mongodb+srv://duykien85:KfnTVFtEL8uF0FQn@cluster0.gd5vymx.mongodb.net/fullstack')
  .then(() => {
    server.listen(3000, () => {
      console.log('Server running port 3000');
    });
  });
