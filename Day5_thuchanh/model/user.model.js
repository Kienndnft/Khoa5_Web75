import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Tao schema/model cho users
const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const userModel = mongoose.model('users', userSchema);

export { userModel };
