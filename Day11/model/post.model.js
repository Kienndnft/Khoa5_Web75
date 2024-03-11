import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userId: String,
  content: String,
  createdAt: String,
  updatedAt: String,
  isPublic: Boolean,
});
const PostModel = mongoose.model('post', PostSchema);

export { PostModel };
