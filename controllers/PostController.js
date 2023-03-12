import PostModel from '../models/Post.js';
import response from '../utils/response.js';
import {validationResult} from 'express-validator';
import {INTERNAL_SERVER_ERROR, UPDATE_POST_ERROR, VALIDATION_ERROR}
  from '../utils/error_codes.js';

/**
 * Возвращает список постов из базы
 * @param {*} req - реквест
 * @param {*} res - ответ
 * @param {String} req.query.user - автор статьи
 * @param {Date} req.query.from - с какой даты получить посты
 * @param {Date} req.query.to - по какую дату получить посты
 */
export const fetchAll = async (req, res) => {
  try {
    const {user, from, to, tags} = req.query;
    const filters = {
      ...(user != undefined && {user: user}),
      ...(tags != undefined && {}),
      ...((from != undefined || to != undefined) && {updatedAt: {
        ...(from != undefined && {$gte: from}),
        ...(to != undefined && {$lt: to}),
      }}),
    };
    const posts = await PostModel.find(filters);
    return response.success(res, posts);
  } catch (error) {
    console.error(error);
    return response.error(res, 500, INTERNAL_SERVER_ERROR, error);
  }
};

/**
 * Создать пост
 * @param {*} req - реквест
 * @param {*} res - ответ
 */
export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.error(res, 400, VALIDATION_ERROR, errors);
  }

  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      views: req.body.views,
      user: req.context._id,
    });

    const post = await doc.save();
    return response.success(res, post);
  } catch (err) {
    console.error(err);
    return response.error(res, 500, INTERNAL_SERVER_ERROR, err);
  }
};

/**
 * Получить пост по id
 * @param {*} req - реквест
 * @param {*} res - ответ
 * @param {String} req.param.id
 */
export const fetchById = async (req, res) => {
  try {
    const post = await PostModel.findById({_id: req.params.id});
    return response.success(res, post);
  } catch (error) {
    console.error(error);
    return response.error(res, 500, INTERNAL_SERVER_ERROR, error);
  }
};

/**
 * Обновить пост
 * @param {*} req - реквест
 * @param {*} res - ответ
 **/
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const {modifiedCount} = await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          title: req.body.title,
          text: req.body.text,
          tags: req.body.tags,
          imageUrl: req.body.imageUrl,
          views: req.body.views,
          user: req.context._id,

        });

    return response.success(res, modifiedCount);
  } catch (error) {
    return response.error(res, 500, UPDATE_POST_ERROR, error);
  }
};

/**
/**
 * Удалить пост
 * @param {*} req - реквест
 * @param {*} res - ответ
 **/
export const deleteById = async (req, res) => {
  try {
    const result = await PostModel.findOneAndDelete({_id: req.params.id});
    return response.success(res, result);
  } catch (error) {
    console.error(error);
    return response.error(res, 500, INTERNAL_SERVER_ERROR, error);
  }
};
