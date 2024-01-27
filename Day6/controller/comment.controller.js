import express from 'express';
import { CommentModel } from '../model/comments.model.js';

const commentController = express.Router();

commentController.get('/', async (req, res) => {
  try {
    const query = req.query;
    const comments = await CommentModel.find(query);
    res.status(200).send({ data: comments, message: 'Get comments', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//=======================================

commentController.post('/', async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    //const createdAt = new Date().toISOString();

    //validate input
    // if (!userId) throw new Error('userId is required');
    // if (!content) throw new Error('content is required');
    // if (!isPublic) throw new Error('isPublic is required');

    //Luu vao co so du lieu
    const newComment = await CommentModel.create({
      postId,
      userId,
      content,
      date: new Date().toISOString(),
    });

    res
      .status(201)
      .send({ data: newComment, message: 'Comments created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { commentController };
