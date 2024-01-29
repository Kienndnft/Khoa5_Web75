//import asyncHandler from 'express-async-handler';
import { PostModel } from '../model/post.model.js';

//=========================================
export const getPosts = async (req, res) => {
  const { query } = req.query;

  const posts = await PostModel.find({ query });

  res.status(200).send({ data: posts, message: 'Get posts', success: true });
};
//=========================================
export const getPostId = async (req, res) => {
  const { postId } = req.params;

  const currentPost = await PostModel.findById(postId);

  res.status(200).send({ data: currentPost, message: 'Get postId', success: true });
};

//=========================================
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { user } = req;

    //Luu vao co so du lieu
    const newPost = await PostModel.create({
      content,
      userId: user._id,
    });

    res.status(201).send({ data: newPost, message: 'Post created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};

// export const createPost = asyncHandler(async (req, res) => {
//   const { content } = req.body;
//   const { user } = req;

//   const newPost = await PostModel.create({
//     content,
//     userId: user._id,
//   });
//   console.log({ newPost });
//   res.status(201).send({ data: newPost, message: 'Post created successfully', success: true });
// });

//=========================================
export const updatePostId = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    //update post
    const updateItem = await PostModel.findByIdAndUpdate(postId, { content }, { new: true });

    res.status(201).send({ data: updateItem, message: 'Post updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
//=========================================
export const deletePostId = async (req, res) => {
  try {
    const { postId } = req.params;

    //delete post
    await PostModel.findByIdAndDelete(postId);

    res.status(204).send('');
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
