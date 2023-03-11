import express from "express";
import mongoose from 'mongoose';
import { registerValidator } from "./validations/auth.js";
import { postValidation, fetchPostsValidation } from "./validations/post.js";
import checkAuth from './utils/checkAuth.js';
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import morgan from "morgan";
import multer from "multer";
import fs from 'fs';
import response from "./utils/response.js";

mongoose.connect(
    'mongodb://127.0.0.1:27017'
).then(() => console.log('- mongo connected'))
.catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
    destination: (req, __, cb) => {
        const id = req.context._id;
        const path = `uploads/${id}`;
        fs.mkdirSync(path, { recursive: true });
        return cb(null, `uploads/${req.context._id}`);
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.set('view engine', 'ejs');

app.use(express.json());
app.use(morgan("- [:method] :url -> :status"));

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', UserController.auth);

app.post('/auth/register', registerValidator, UserController.register);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    const id = req.context._id;
    const path = `uploads/${id}/${req.file.originalname}`;
    response.success(res, path);
});


app.get('/posts', checkAuth, fetchPostsValidation, PostController.fetchAll);
app.post('/posts', checkAuth, postValidation, PostController.create);

app.get('/posts/:id', checkAuth, postValidation, PostController.fetchById);
app.delete('/posts/:id', checkAuth, postValidation, PostController.deleteById);
app.patch('/posts/:id', checkAuth, postValidation, PostController.update);


app.use((req, res, __) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
});



app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('- server started');
});