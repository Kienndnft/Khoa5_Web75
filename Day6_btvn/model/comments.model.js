import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt columns
  }
);
const CommentModel = mongoose.model('comments', CommentSchema);

export { CommentModel };
