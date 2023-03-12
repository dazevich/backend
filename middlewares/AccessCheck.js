import {ACCESS_DENIED} from '../utils/error_codes.js';
import response from '../utils/response.js';

export default (req, res, next) => {
  if (req.context._id === undefined) {
    return response.error(res, 401, ACCESS_DENIED, 'access denied');
  }

  next();
};
