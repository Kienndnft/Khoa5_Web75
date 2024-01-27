import express from 'express';
import { PostModel } from '../model/post.model.js';

const postController = express.Router();

postController.get('/', async (req, res) => {
  try {
    const query = req.query;
    const posts = await PostModel.find(query);
    res.status(200).send({ data: posts, message: 'Get posts', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//=======================================

postController.post('/', async (req, res) => {
  try {
    const { content, date } = req.body;
    //const createdAt = new Date().toISOString();

    //validate input
    // if (!userId) throw new Error('userId is required');
    // if (!content) throw new Error('content is required');
    // if (!isPublic) throw new Error('isPublic is required');

    //Luu vao co so du lieu
    const newPost = await PostModel.create({
      content,
      date: new Date().toISOString(),
    });

    res.status(201).send({ data: newPost, message: 'Post created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { postController };
