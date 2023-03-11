import PostModel from '../models/Post.js';
import response from '../utils/response.js';
import { validationResult } from 'express-validator';
import { INTERNAL_SERVER_ERROR, VALIDATION_ERROR } from '../utils/error_codes.js';

export const fetchAll = async (req, res) => {
    try {
        const {user, from, to} = req.query;
        const filters = {
            ...(user != undefined && {user: user}),
            ...((from != undefined || to != undefined) && {updatedAt: {
                ...(from != undefined && {$gte: from}),
                ...(to != undefined && {$lt: to}),
            }}),
        };
        console.log(filters);
        const posts = await PostModel.find(filters);
        response.success(res, posts);
    } catch (error) {
        console.error(error);
        response.error(res, 500, INTERNAL_SERVER_ERROR, error);
    }
}

export const create = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return response.error(res, 400, VALIDATION_ERROR, errors);
    }

    console.log(req.context);

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
        return res.json(doc);

    } catch(err) {
        console.log(err);
        return response.error(res, 500, INTERNAL_SERVER_ERROR, err);
    }
}

export const fetchById = async (req, res) => {
    try {
        const post = await PostModel.findById({_id: req.params.id});
        return response.success(res, post);
    } catch(error) {
        console.error(error);
        return response.error(res, 500, INTERNAL_SERVER_ERROR, error);
    }
}

export const update = async (req, res) => {}

export const deleteById = async (req, res) => {}