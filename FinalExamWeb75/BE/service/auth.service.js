import { UserModel } from '../model/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

//=======================================
export const register = async (req, res) => {
  const { username, password } = req.body;

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashesPassword = await bcrypt.hash(password, salt);

  //Tao moi user tren mongodb
  const newUser = await UserModel.create({
    username,
    password: hashesPassword,
    //roles: ['user'],
  });

  res.status(201).send({ data: newUser, message: 'Register user successfully', success: true });
};
//=======================================
export const login = async (req, res) => {
  const { username, password } = req.body;

  //tim kiem theo username hoac email
  const user = await UserModel.findOne({ username });
  if (!user) throw new Error('Username/password not correct');

  //hashing
  const result = await bcrypt.compare(password, user.password);
  if (!result) throw new Error('Username/password not correct');

  //encode
  const payload = {
    id: user._id.toString(),
    username: user.username,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '5m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '1d' });
  //console.log({ accessToken, refreshToken });

  res.status(200).send({
    data: { accessToken, refreshToken },
    message: 'Login successfully',
    success: true,
  });
};
//=======================================
export const refresh = (req, res) => {
  const { refreshToken } = req.body;
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

  //Remove 2 property iat, exp co trong refreshToken
  const newPayload = _.omit(payload, ['iat', 'exp']);
  //console.log({ newPayload });

  //Tao bo token moi
  const accessToken = jwt.sign(newPayload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '5m' });
  const newRefreshToken = jwt.sign(newPayload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '1d' });

  res
    .status(200)
    .send({ data: { accessToken, newRefreshToken }, message: 'Renew successfully', success: true });
};
