import jwt from 'jsonwebtoken';
import {ACCESS_DENIED} from './error_codes.js';
import response from './response.js';
import UserModel from './../models/User.js';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return response.error(res, 401, ACCESS_DENIED, 'unauthorized');
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer') {
    return response.error(res, 400, ACCESS_DENIED, 'unauthorized');
  }

  const payload = jwt.verify(token, '123');

  const user = await UserModel.findById(payload._id);

  const {passHash, ...userData} = user._doc;
  req.context = {...userData};

  next();
};
