import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/database.js';
import { userController } from './controller/user.controller.js';
import { postController } from './controller/post.controller.js';
import { commentController } from './controller/comment.controller.js';

//reads the contents of the .env file in the root of your project and loads the variables into process.env
dotenv.config();

const server = express();

//Middleware. This middleware parses the JSON data from the request body and makes it available in the request.body object.
server.use(express.json());

server.use('/users', userController);
server.use('/posts', postController);
server.use('/comments', commentController);

connectDb().then(
  server.listen(process.env.PORT, () => {
    console.log('Server running');
  })
);
