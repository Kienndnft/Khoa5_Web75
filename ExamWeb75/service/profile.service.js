import { ProfileModel } from '../model/profile.model.js';

export const getProfile = async (req, res, next) => {
  const profile = await ProfileModel.findById(req.user.id);
  res.status(200).send(profile);
};
