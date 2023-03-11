import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import response from "../utils/response.js";
import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';

export const register = async (req, res) => {   
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        name: req.body.name,
        login: req.body.login,
        passHash,
    });

   try{
    const user = await doc.save();
    const token = jwt.sign({
        _id: user._id,
    }, 
    '123', 
    {
        expiresIn: '30d'
    });
    res.status(200).json({
        success: true,
        data: token,
    });
   } catch (err) {
    if(err.code === 11000) {
        return res.status(500).json({
            success: false,
            err: 'Пользователь с такими данными уже зарегистрирован',
        });
    }
    res.status(500).json({
        success: false,
        err: err,
    });
   }
};

export const auth = async (req, res) => {
    const login = req.body.login;
    const pass = req.body.password;

    const user = await UserModel.findOne({login: login});

    if(!user) {
        return response.error(res, 400, 2, 'invalid auth data');
    }

    const isValidPass = await bcrypt.compare(pass, user._doc.passHash);

    if(!isValidPass) {
        return response.error(res, 400, 2, 'invalid auth data');
    }

    const token = jwt.sign({
        _id: user._id,
    },
    '123'
    );
    
    return response.success(res, token);
}