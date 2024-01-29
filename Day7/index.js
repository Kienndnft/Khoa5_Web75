import express from 'express';
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import { UserModel } from './user.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const server = express();

server.use(express.json());
server.use(morgan('combined'));

server.post('/index', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) throw new Error('username required');
    if (!password) throw new Error('password required');

    //hashing
    // const saltRounds = 10;
    // bcrypt.genSalt(saltRounds, function (err, salt) {
    //   bcrypt.hash(password, salt, function (err, hash) {
    //     res.status(200).send(hash);
    //   });
    // });
    const salt = await bcrypt.genSalt(10);
    const hashesPassword = await bcrypt.hash(password, salt);
    console.log(hashesPassword);

    //luu vao db
    await UserModel.create({
      username,
      password: hashesPassword,
    });

    res.status(200).send('Register successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

server.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) throw new Error('username required');
    if (!password) throw new Error('password required');

    //hashing
    const user = await UserModel.findOne({ username });
    const result = await bcrypt.compare(password, user.password);
    console.log(result);

    if (!result) throw new Error('Username/password not correct');

    res.status(200).send('Login successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

mongoose
  .connect('mongodb+srv://duykien85:KfnTVFtEL8uF0FQn@cluster0.gd5vymx.mongodb.net/fullstack')
  .then(() => {
    server.listen(3000, () => {
      console.log('Server running port 3000');
    });
  });
