import express from 'express';
//import { validationComment } from '../middleware/comment.validation.js';

import {
  createComment,
  deleteCommentId,
  getCommentId,
  getComments,
  updateCommentId,
} from '../controller/comment.controller.js';
import {
  validationBodyComment,
  validationComment,
  validationIsAdmin,
} from '../middleware/validation.js';

const commentRoute = express.Router();

//admin only
commentRoute.get('/', validationIsAdmin, getComments); //Validate admin thi mới được get all posts

//user & admin
commentRoute.post('/', validationBodyComment, createComment); //Validate body comment truoc khi tao comment
commentRoute.get('/:commentId', validationComment, getCommentId); //Validate ccmmentId co ton tai, user co phai la nguoi tao comment
commentRoute.put('/:commentId', validationComment, validationBodyComment, updateCommentId); // validate user > validate body
commentRoute.delete('/:commentId', validationComment, deleteCommentId);

export { commentRoute };
