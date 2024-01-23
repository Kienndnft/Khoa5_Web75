import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Tao schema/model cho users
const postSchema = new Schema({
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});
const postModel = mongoose.model('posts', postSchema);

export { postModel };
