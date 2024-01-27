import express from 'express';
import { validationPost } from '../middleware/post.validation.js';
import {
  createPost,
  deletePostId,
  getPostId,
  getPosts,
  updatePostId,
} from '../controller/post.controller.js';

const postRoute = express.Router();

postRoute.get('/', validationPost, getPosts);
postRoute.get('/:postId', validationPost, getPostId);
postRoute.post('/', createPost);
postRoute.put('/:postId', validationPost, updatePostId);
postRoute.delete('/:postId', validationPost, deletePostId);

export { postRoute };
