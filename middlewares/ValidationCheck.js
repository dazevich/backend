import {validationResult} from 'express-validator';
import {VALIDATION_ERROR} from '../utils/error_codes.js';
import response from '../utils/response.js';

export const validationCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.error(res, 400, VALIDATION_ERROR, errors);
  }

  next();
};
