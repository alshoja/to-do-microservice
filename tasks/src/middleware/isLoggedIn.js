import jwt from 'jsonwebtoken';
export default (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const error = new Error('Authorization error');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        err.statusCode = 500
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Authorization error');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};