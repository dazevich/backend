import express from 'express';
import {Router} from 'express';
import multer from 'multer';
import fs from 'fs';
import response from '../utils/response.js';
import {authCheck} from '../middlewares/index.js';

const router = new Router();

const storage = multer.diskStorage({
  destination: (req, __, cb) => {
    const id = req.context._id;
    const path = `uploads/${id}`;
    fs.mkdirSync(path, {recursive: true});
    return cb(null, `uploads/${req.context._id}`);
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage});

router.use('/uploads', express.static('uploads'));

router.post('/upload', authCheck, upload.single('image'), (req, res) => {
  const id = req.context._id;
  const path = `uploads/${id}/${req.file.originalname}`;
  response.success(res, path);
});

export default router;
