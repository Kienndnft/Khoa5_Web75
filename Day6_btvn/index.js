import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { postRoute } from './route/post.route.js';
import { commentRoute } from './route/comment.route.js';
import { userRoute } from './route/user.route.js';
import { authenticationMiddleware } from './middleware/authentication.middleware.js';
import { authorizationMiddleware } from './middleware/authorization.middleware.js';
import { publicRouteMiddleware } from './middleware/publicRoute.middleware.js';

//reads the contents of the .env file in the root of your project and loads the variables into process.env
dotenv.config();

const server = express();

server.use(express.json());
server.use(morgan('combined'));

//Route public , khong can authen
server.use('/register', publicRouteMiddleware);

//Authen cho toan bo server
server.use(authenticationMiddleware);

server.use('/register', userRoute);
server.use('/users', authorizationMiddleware, userRoute);
server.use('/posts', authorizationMiddleware, postRoute);
server.use('/comments', authorizationMiddleware, commentRoute);

mongoose.connect(`${process.env.MONGO_CONNECT}/fullstack`).then(() => {
  server.listen(process.env.PORT, () => {
    console.log('Server running...');
  });
});
