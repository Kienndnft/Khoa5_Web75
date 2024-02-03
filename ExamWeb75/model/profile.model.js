import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    userid: { type: String, required: true },
    name: { type: String, required: true },
    birth: { type: String, required: true },
    place: { type: String, required: true },
    nationality: { type: String, required: true },
  },
  { timestamps: true } // This will add createdAt and updatedAt columns
);
const ProfileModel = mongoose.model('profiles', ProfileSchema);

export { ProfileModel };
