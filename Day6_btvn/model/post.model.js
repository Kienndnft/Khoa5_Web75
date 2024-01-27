import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userId: String,
  content: String,
  date: String,
});
const PostModel = mongoose.model('posts', PostSchema);

export { PostModel };
