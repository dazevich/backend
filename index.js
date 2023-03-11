import express from "express";
import mongoose from 'mongoose';
import { registerValidator } from "./validations/auth.js";
import { postValidation } from "./validations/post.js";
import checkAuth from './utils/checkAuth.js';
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import morgan from "morgan";

mongoose.connect(
    'mongodb://127.0.0.1:27017'
).then(() => console.log('- mongo connected'))
.catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(morgan(":method :url :status"));

app.post('/auth/login', UserController.auth);

app.post('/auth/register', registerValidator, UserController.register);



app.get('/posts', checkAuth, postValidation, PostController.fetchAll);
app.post('/posts', checkAuth, postValidation, PostController.create);

app.get('/posts/:id', checkAuth, postValidation, PostController.fetchById);
app.delete('/posts/:id', checkAuth, postValidation, PostController.deleteById);
app.patch('/posts/:id', checkAuth, postValidation, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('- server started');
});