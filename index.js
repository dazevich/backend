import express from 'express';
import mongoose from 'mongoose';
import {default as authRouter} from './routes/auth/Auth.js';
import {default as postsRouter} from './routes/post/Post.js';
import {authCheck, filesUploader, pageNotFound, logger}
  from './middlewares/index.js';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env;
const DB_ADDR = env.DB_ADDR;
const PORT = env.PORT;

mongoose.connect(DB_ADDR)
    .then((db) => console.debug(`[server] mongo connected ${db.version}`))
    .catch((err) => console.error(err));

const app = express();

app.use(express.json());

app.use(authCheck, logger, filesUploader);

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.use(pageNotFound);

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  console.debug(`[server] listen port ${PORT}`);
});
