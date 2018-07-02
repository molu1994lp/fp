import mongoose from 'mongoose'
import {
    UserSchema
} from '../models/userModel';
var bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import {
    config
} from '../../config';

const User = mongoose.model('User', UserSchema);
const saltRounds = 10;

export const createUser = (req, resp) => {
    let newUser = req.body;

    if (newUser.password !== newUser.repassword) {
        resp.status(400);
        resp.send("Passwords aren't same");
    } else {
        User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                resp.send(err);
            }
            if (user) {
                resp.status(400);
                resp.send("User has already exist");

            } else {
                delete newUser[`repassword`];
                bcrypt.hash(newUser.password, saltRounds, (error, hash) => {
                    if (error) {
                        throw new Error('Password hash problem');
                    } else {
                        newUser.password = hash;
                        const createdUser = new User(newUser);
                        createdUser.save((er, user) => {
                            if (er) {
                                resp.send(er)
                            }
                            if (user) {
                                resp.send(201);
                            }
                        });
                    }
                });
            }
        });
    }
};

export const login = (req, resp) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            resp.status(404);
            resp.send("User not found");
        } else if (user) {
            bcrypt.compare(req.body.password, user.password, (error, res) => {
                if (error) throw error;
                if (res === true) {
                    const payload = {
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                    const token = jwt.sign(payload, config.secret, {
                        expiresIn: 60 * 60
                    });
                    resp.json({
                        message: "Token expires after 1 hours.",
                        token: token,
                        success: true
                    })
                } else if (res == false) {
                    resp.status(400);
                    resp.send("Wrong password");
                }
            });
        }
    });
};