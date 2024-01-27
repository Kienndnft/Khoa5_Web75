// import express from 'express';
// import { CommentModel } from '../model/comments.model.js';

import { CommentModel } from '../model/comments.model.js';
import { PostModel } from '../model/post.model.js';

// const commentController = express.Router();

// commentController.get('/', async (req, res) => {
//   try {
//     const query = req.query;
//     const comments = await CommentModel.find(query);
//     res.status(200).send({ data: comments, message: 'Get comments', success: true });
//   } catch (error) {
//     res.status(403).send({ data: null, message: error.message, success: false });
//   }
// });

// //=======================================

// commentController.post('/', async (req, res) => {
//   try {
//     const { postId, userId, content } = req.body;
//     //const createdAt = new Date().toISOString();

//     //validate input
//     // if (!userId) throw new Error('userId is required');
//     // if (!content) throw new Error('content is required');
//     // if (!isPublic) throw new Error('isPublic is required');

//     //Luu vao co so du lieu
//     const newComment = await CommentModel.create({
//       postId,
//       userId,
//       content,
//       date: new Date().toISOString(),
//     });

//     res
//       .status(201)
//       .send({ data: newComment, message: 'Comments created successfully', success: true });
//   } catch (error) {
//     res.status(403).send({ data: null, message: error.message, success: false });
//   }
// });

// export { commentController };

//=========================================
export const getComments = async (req, res) => {
  const { query } = req.query;

  const comments = await CommentModel.find({ query });

  res.status(200).send({ data: comments, message: 'Get comments', success: true });
};
//=========================================
export const getCommentId = async (req, res) => {
  const { commentId } = req.params;

  const current = await CommentModel.findById(commentId);

  res.status(200).send({ data: current, message: 'Get commentId', success: true });
};
//=========================================
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const { user } = req;

    //validate input
    if (!content) throw new Error('content is required');
    if (!postId) throw new Error('postId is required');

    //Check postId co ton tai
    const current = await PostModel.findById(postId);
    if (!current) throw new Error('postId does not exist');

    //Luu vao db
    const newComment = await CommentModel.create({
      content,
      postId,
      userId: user._id,
      date: new Date().toISOString(),
    });

    res
      .status(201)
      .send({ data: newComment, message: 'Comment created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//=========================================
export const updateCommentId = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const { commentId } = req.params;

    //validate input
    if (!content) throw new Error('content is required');
    if (!postId) throw new Error('postId is required');

    //update comment
    const updateItem = await CommentModel.findByIdAndUpdate(commentId, { content }, { new: true });

    res
      .status(201)
      .send({ data: updateItem, message: 'Comment updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};

//=========================================
export const deleteCommentId = async (req, res) => {
  try {
    const { commentId } = req.params;

    //delte post
    await CommentModel.findByIdAndDelete(commentId);

    res.status(204).send();
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
