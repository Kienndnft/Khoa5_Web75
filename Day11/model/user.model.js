import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  avatar: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const UserModel = mongoose.model('user', UserSchema);

export { UserModel };
