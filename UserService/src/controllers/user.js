/* eslint-disable no-unused-vars */
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.allUsers = (req, res, next) => {
    User.find().then(users => {
        res.status(200).json({ users: users })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.user = (req, res, next) => {
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

exports.createUser = (req, res, next) => {
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

exports.updateUser = (req, res, next) => {
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

exports.deleteUser = (req, res, next) => {
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