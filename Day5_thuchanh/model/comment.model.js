import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Tao schema/model cho users
const commentSchema = new Schema({
  content: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});
const commentModel = mongoose.model('comments', commentSchema);

export { commentModel };
