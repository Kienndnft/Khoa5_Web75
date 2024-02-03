import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [String],
    posts: [{ type: mongoose.Types.ObjectId, ref: 'posts' }],
  },
  { timestamps: true } // This will add createdAt and updatedAt columns
);
const UserModel = mongoose.model('users', UserSchema);

export { UserModel };
