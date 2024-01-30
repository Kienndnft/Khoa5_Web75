import { CommentModel } from '../model/comments.model.js';

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

    //Luu vao db
    const newComment = await CommentModel.create({
      content,
      postId,
      userId: user._id,
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
    const { content } = req.body;
    const { commentId } = req.params;

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
