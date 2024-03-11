import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authController } from './controller/auth.controller.js';
import { movieController } from './controller/movie.controller.js';

//reads the contents of the .env file in the root of your project and loads the variables into process.env
dotenv.config();

const server = express();

server.use(express.json());
server.use(morgan('combined'));

server.use('/auth', authController);
server.use('/movie', movieController);

server.use('/index', (req, res) => {
  res.status(200).send('Hello world');
});

mongoose.connect(`${process.env.MONGO_CONNECT}/finalExamWeb75`).then(() => {
  server.listen(process.env.PORT || 8080, () => {
    console.log('Server running...');
  });
});
