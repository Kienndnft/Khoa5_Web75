import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  roles: [String],
});
const UserModel = mongoose.model('users', UserSchema);

export { UserModel };
