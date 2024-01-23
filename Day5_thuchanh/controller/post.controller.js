import express from 'express';
import { postModel } from '../model/post.model.js';
import { isObjectIdOrHexString } from 'mongoose';
import { userModel } from '../model/user.model.js';
import { commentModel } from '../model/comment.model.js';

const postController = express.Router();

//GET ALL
postController.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    const posts = await postModel.find({ query });
    res.status(200).send({ data: posts, message: 'Get posts', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//GET ALL WITH COMMENTs
postController.get('/postwithcomments', async (req, res) => {
  try {
    const posts = await postModel.find({});
    const comments = await commentModel.find({});

    const postWithComments = posts.map((post) => {
      const commentsByPost = comments.filter(
        (comment) => comment.postId.toString() === post._id.toString()
      );
      const threeComments = commentsByPost.slice(0, 3);

      return { ...post._doc, comments: threeComments };

      //Luu y: neu dung {...post} > co nhieu du lieu khac hien thi
    });

    res
      .status(200)
      .send({ data: postWithComments, message: 'Get posts with 3 first comments', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//GET ONE
postController.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    //Validate id user
    if (!isObjectIdOrHexString(postId)) throw new Error('ID is not valid');

    const post = await postModel.findById(postId);

    //Get comments
    const comments = await commentModel.find({ postId });

    const postWithComments = { ...post._doc, comments: comments };

    res.status(200).send({ data: postWithComments, message: 'Get post', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//2. Viết API cho phép user tạo bài post
postController.post('/', async (req, res) => {
  try {
    const { content, authorId } = req.body;

    //Validate input
    if (!content) throw new Error('content is required');
    if (!isObjectIdOrHexString(authorId)) throw new Error('authorId is not valid');

    //Check authorId co thuoc usersModel
    const validUserId = await userModel.findById(authorId);
    if (!validUserId) throw new Error('authorId does not exist');

    //Tao moi post tren mongodb
    const newItem = await postModel.create({
      content,
      authorId,
    });

    res.status(201).send({ data: newItem, message: 'Post created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { postController };

//3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
postController.put('/:postId', async (req, res) => {
  try {
    const { content, authorId } = req.body;
    const { postId } = req.params;

    //validate input
    if (!content) throw new Error('content is required');
    if (!authorId) throw new Error('authorId is required');
    if (!isObjectIdOrHexString(postId)) throw new Error('postId is not valid');

    //Check postId co ton tai
    const currentPost = await postModel.findById(postId);
    if (!currentPost) throw new Error('postId does not exist');

    //Check user cua post co trung voi user chinh sua post
    if (currentPost.authorId.toString() !== authorId) throw new Error('userId does not have right');

    //update post
    const updateItem = await postModel.findByIdAndUpdate(postId, { content }, { new: true });

    res.status(201).send({ data: updateItem, message: 'Post updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
