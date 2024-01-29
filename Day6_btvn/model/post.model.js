import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    content: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt columns
  }
);
const PostModel = mongoose.model('posts', PostSchema);

export { PostModel };
