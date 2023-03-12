import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const authCheck = async (req, _, next) => {
  const authHeader = req.headers.authorization;
  if ( !authHeader ) {
    return next();
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer') {
    return next();
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(payload._id);

  // eslint-disable-next-line no-unused-vars
  const {__, ...userData} = user._doc;

  req.context = {...userData};

  next();
};
