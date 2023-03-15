import User from '../models/user.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default (channel) => {
    const login = (req, res, next) => {
        let loadedUser;
        User.findOne({ username: req.body.username })
            .then(user => {
                if (!user) {
                    const error = new Error('A user or email could not be found');
                    error.statusCode = 401;
                    throw error;
                }
                loadedUser = user;
                return bcrypt.compare(req.body.password, user.password)
            }).then(isEqual => {
                if (!isEqual) {
                    const error = new Error('Wrong password !');
                    error.statusCode = 401;
                    throw error;
                }
                const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                }, 'secret', { expiresIn: '24h' });
                res.status(200).json({ token: token, userId: loadedUser._id.toString() });
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
    return {
        login
    }
}
