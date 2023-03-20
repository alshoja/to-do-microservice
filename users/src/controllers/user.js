import User from '../models/user.js'
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { RPCObserver, SubscribeMessage } from '../util/index.js';

export default (channel) => {
    const status = (req, res, next) => {
        res.status(200).json({ message: 'User Service Up' });
    }

    const allUsers = (req, res, next) => {
        User.find().then(users => {
            res.status(200).json({ users: users })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }

    const user = (req, res, next) => {
        const userId = req.params.userId;
        User.findById(userId).then(user => {
            if (!user) {
                const error = new Error('No user found');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ user: user })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }

    const createUser = (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ message: 'Validation failed', errors: validationErrors.array() })
        }
        bcrypt.hash(req.body.password, 12).then(hashedPw => {
            const user = new User({
                name: req.body.name,
                username: req.body.username,
                password: hashedPw
            });
            user.save().then(user => {
                res.status(200).json({ message: 'User successfully registered !', userId: user._id })
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })

    }

    const updateUser = (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({ message: 'Validation failed', errors: validationErrors.array() })
        }
        const userId = req.params.userId;
        User.findById(userId).then(user => {
            if (!user) {
                const error = new Error('No user found');
                error.statusCode = 404;
                throw error;
            }
            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;
            return user.save();
        }).then(user => {
            res.status(200).json({ message: 'User updated !', user: user })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }

    const deleteUser = (req, res, next) => {
        const userId = req.params.userId;
        User.findById(userId).then(user => {
            if (!user) {
                const error = new Error('No user found');
                error.statusCode = 404;
                throw error;
            }
            return User.findByIdAndRemove(userId).then(user => {
                res.status(200).json({ message: 'User deleted', user: user });
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
        })
    }

    const SubscribeEvents = async (payload) => {
        console.log('Triggering.... activity Events')
        payload = JSON.parse(payload)
        console.log('payload from rabbit', payload)
        // createActivity(payload);
    }


    const findById = async (id) => {
        try {
            const user = User.findById(id);
            if (!user) {
                const error = new Error('No user found');
                error.statusCode = 404;
                throw error;
            }
            return user
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
        }

    }

    const serveRPCRequest = async (payload) => {
        const userId = payload.data
        return await findById(userId);
    }

    RPCObserver(process.env.RPC_QUEUE_NAME, serveRPCRequest);
    SubscribeMessage(channel, SubscribeEvents, process.env.USER_BINDING_KEY)
    return {
        allUsers,
        user,
        updateUser,
        createUser,
        deleteUser,
        status
    }

}