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

    //validate input
    if (!content) throw new Error('content is required');

    //Luu vao co so du lieu
    const newPost = await PostModel.create({
      userId: user._id,
      content,
      date: new Date().toISOString(),
    });

    res.status(201).send({ data: newPost, message: 'Post created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};

//=========================================
export const updatePostId = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    //validate input
    if (!content) throw new Error('content is required');

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

    //delte post
    await PostModel.findByIdAndDelete(postId);

    res.status(204).send();
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
};
