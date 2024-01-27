import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  postId: String,
  userId: String,
  content: String,
  date: String,
});
const CommentModel = mongoose.model('comments', CommentSchema);

export { CommentModel };
