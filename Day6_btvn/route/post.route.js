import express from 'express';
import {
  createPost,
  deletePostId,
  getPostId,
  getPosts,
  updatePostId,
} from '../controller/post.controller.js';
import { validationBodyPost, validationIsAdmin, validationPost } from '../middleware/validation.js';

const postRoute = express.Router();

//admin only
postRoute.get('/', validationIsAdmin, getPosts); //Validate admin thi mới được get all posts

//user & admin
postRoute.get('/:postId', validationPost, getPostId); //Validate user của post thì mới get được postId, admin thì không cần validate
postRoute.post('/', validationBodyPost, createPost); //Validate body cua post truoc khi tao post
postRoute.put('/:postId', validationPost, validationBodyPost, updatePostId); //Validate user > validate body post
postRoute.delete('/:postId', validationPost, deletePostId); //Validate user

export { postRoute };
