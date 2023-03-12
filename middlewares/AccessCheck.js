import {ACCESS_DENIED} from '../utils/error_codes.js';
import response from '../utils/response.js';

export default (req, res, next) => {
  if (req.user._id === undefined) {
    return response.error(res, 401, ACCESS_DENIED, 'access denied');
  }

  console.log(req.user);
  next();
};
