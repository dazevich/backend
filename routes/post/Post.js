import {Router} from 'express';
import * as Middlewares from '../../middlewares/index.js';
import * as PostController from '../../controllers/PostController.js';
import {postValidation, fetchPostsValidation} from '../../validations/post.js';

export default Router()
    .get('/', Middlewares.accessCheck, fetchPostsValidation, Middlewares.validationCheck, PostController.fetchAll)
    .get('/:id', Middlewares.accessCheck, PostController.fetchById)
    .post('/', Middlewares.accessCheck, postValidation, Middlewares.validationCheck, PostController.create)
    .delete('/:id', Middlewares.accessCheck, PostController.deleteById)
    .patch('/:id', Middlewares.accessCheck, PostController.update);

