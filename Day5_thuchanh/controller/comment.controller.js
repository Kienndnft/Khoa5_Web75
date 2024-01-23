import express from 'express';
import { commentModel } from '../model/comment.model.js';
import { isObjectIdOrHexString } from 'mongoose';
import { postModel } from '../model/post.model.js';

const commentController = express.Router();

//GET ALL
//6. Viết API lấy tất cả comment của một bài post. (su dung query params, vi du: http://localhost:3000/comments?postId=65af3378c7b73442458cb400)
commentController.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    const comments = await commentModel.find({ query });
    res.status(200).send({ data: comments, message: 'Get comments', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//GET ONE
commentController.get('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    //Validate id comment
    if (!isObjectIdOrHexString(commentId)) throw new Error('ID is not valid');

    const comment = await commentModel.findById(commentId);
    res.status(200).send({ data: comment, message: 'Get comment', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//4. Viết API cho phép user được comment vào bài post
commentController.post('/', async (req, res) => {
  try {
    const { content, postId, authorId } = req.body;

    //Validate input
    if (!content) throw new Error('content is required');
    if (!authorId) throw new Error('authorId is required');
    if (!isObjectIdOrHexString(postId)) throw new Error('postId is not valid');

    //Check postId co ton tai
    const currentPost = await postModel.findById(postId);
    if (!currentPost) throw new Error('postId does not exist');

    //Tao moi post tren mongodb
    const newItem = await commentModel.create({
      content,
      postId,
      authorId,
    });

    res.status(201).send({ data: newItem, message: 'Comment created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
commentController.put('/:commentId', async (req, res) => {
  try {
    const { content, authorId } = req.body;
    const { commentId } = req.params;

    //Validate input
    if (!content) throw new Error('content is required');
    if (!authorId) throw new Error('authorId is required');
    if (!isObjectIdOrHexString(commentId)) throw new Error('commentId is not valid');

    //Check commentId co ton tai
    const current = await commentModel.findById(commentId);
    if (!current) throw new Error('commentId does not exist');

    //Check user cua comment co trung voi user chinh sua comment
    if (current.authorId.toString() !== authorId)
      throw new Error('userId does not have right to edit comment');

    //update comment
    const updateItem = await commentModel.findByIdAndUpdate(commentId, { content }, { new: true });

    res
      .status(201)
      .send({ data: updateItem, message: 'Comment updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { commentController };
