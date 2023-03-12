import {ENDPOINT_NOT_EXIST} from '../utils/error_codes.js';
import response from '../utils/response.js';

export default (req, res, next) => {
  response.error(res, 404, ENDPOINT_NOT_EXIST, req.url);
};
