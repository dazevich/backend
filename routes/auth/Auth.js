import {Router} from 'express';
import * as UserController from '../../controllers/UserController.js';
import * as Middlewares from '../../middlewares/index.js';

export default Router()
    .post('/signin', UserController.auth)
    .post('/signup', Middlewares.validationCheck, UserController.register);
