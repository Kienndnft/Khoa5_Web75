import express from 'express';
import { validationComment } from '../middleware/comment.validation.js';

import {
  createComment,
  deleteCommentId,
  getCommentId,
  getComments,
  updateCommentId,
} from '../controller/comment.controller.js';

const commentRoute = express.Router();

commentRoute.post('/', createComment);
commentRoute.get('/', validationComment, getComments);
commentRoute.get('/:commentId', validationComment, getCommentId);
commentRoute.put('/:commentId', validationComment, updateCommentId);
commentRoute.delete('/:commentId', validationComment, deleteCommentId);

export { commentRoute };
