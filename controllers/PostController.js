import PostModel from '../models/Post.js';
import response from '../utils/response.js';
import { validationResult } from 'express-validator';
import { INTERNAL_SERVER_ERROR, UPDATE_POST_ERROR, VALIDATION_ERROR } from '../utils/error_codes.js';

export const fetchAll = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return response.error(res, 400, VALIDATION_ERROR, errors);
    }

    try {
        const {user, from, to, tags} = req.query;
        console.log(user);
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

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const {modifiedCount, ..._} = await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                views: req.body.views,
                user: req.context._id,
            
            });
    
        response.success(res, modifiedCount);
    } catch (error) {
        response.error(res, 500, UPDATE_POST_ERROR, error);
    }
}

export const deleteById = async (req, res) => {
    try {
        console.log(req.params.id);
        const result = await PostModel.findOneAndDelete({_id: req.params.id});
        return response.success(res, result);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, INTERNAL_SERVER_ERROR, error);
    }
}