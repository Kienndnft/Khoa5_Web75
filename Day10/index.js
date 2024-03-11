import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
// import { userController } from './controller/user.controller.js';
// import { authController } from './controller/auth.controller.js';
// import { asyncCatch } from './utils/trycatch.js';import express from "express";

import { v2 as cloudinary } from 'cloudinary';

//reads the contents of the .env file in the root of your project and loads the variables into process.env
dotenv.config();

const server = express();

server.use(express.json());
server.use(morgan('combined'));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./upload");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
//   },
// });

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: String,
  createdAt: String,
  isPublic: Boolean,
  attachment: [
    {
      publicId: String,
      url: String,
    },
  ],
});

const PostModel = mongoose.model('post', PostSchema);

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './upload');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
//   },
// });
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

server.use('/index', (req, res) => res.status(200).send('Hello mindx!'));

server.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    //const buffer = file.buffer?.data || [];

    const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString('base64')}`;
    const fileName = file.originalname.split('.')[0];

    const result = await cloudinary.uploader.upload(dataUrl, {
      public_id: fileName,
      //resource_type: 'auto',
    });

    const post = await PostModel.create({
      content: req.body.content,
      createdAt: new Date().getTime(),
      isPublic: req.body.isPublic,
      attachment: [
        {
          publicId: result.public_id,
          url: result.url,
        },
      ],
    });

    res.status(201).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error');
  }
});

// server.post('/posts', upload.array('files'), async (req, res) => {
//   try {
//     const files = req.files; // upload.array
//     if (files.length > 2 || files.every((file) => file.size > 5 * 1024)) {
//       res.status(400).send('Too many files or files too large');
//     }
//     // const file = req.file // upload.single
//     const imageUrls = [];
//     for (const file of files) {
//       // const buffer = file.buffer?.data || []
//       const dataUrl = `data:${file.mimetype};base64,${file.buffer?.toString('base64')}`;
//       const fileName = file.originalname.split('.')[0];

//       const result = await cloudinary.uploader.upload(dataUrl, {
//         public_id: fileName,
//       });

//       imageUrls.push({ publicId: result.public_id, url: result.url });
//     }

//     const post = await PostModel.create({
//       content: req.body.content,
//       createdAt: new Date().getTime(),
//       isPublic: req.body.isPublic,
//       attachment: imageUrls,
//     });

//     res.status(201).send(post);
//   } catch (error) {
//     console.log('error :>> ', error);
//     res.status(500).send('Error!');
//   }
// });

server.delete('/posts/:postId', async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
      res.status(400).send('No post found!');
    }

    for (const attachment of post.attachment) {
      const publicId = attachment.publicId;
      await cloudinary.uploader.destroy(publicId);
    }

    await PostModel.findByIdAndDelete(req.params.postId);
    res.sendStatus(204);
  } catch (error) {
    console.log('error :>> ', error);
    res.status(500).send('Error!');
  }
});

// Register user + avatar
server.post('register', () => {});
// Delete user
// Update post
// GET post
// User - post relationship

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './upload');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
//   },
// });
// const upload = multer({ storage: diskStorage });

// server.use('/users', userController);
// server.use('/auth', authController);

// server.post('upload', upload.single('file'), async (req, res) => {
//   try {
//     res.status(200).send(req.file);
//   } catch (error) {
//     res.status(404).send('Error');
//   }
// });

mongoose.connect(`${process.env.MONGO_CONNECT}/fullstack`).then(() => {
  server.listen(process.env.PORT, () => {
    console.log('Server running...');
  });
});
