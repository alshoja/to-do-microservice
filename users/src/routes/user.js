
const userModule = require('../controllers/user');
const authModule = require('../controllers/auth');
const { body } = require('express-validator');
const User = require('../models/user');
const isGuarded = require('../middleware/isLoggedIn')
module.exports = (router, channel) => {
    const userController = userModule(channel)
    const authController = authModule(channel)
    router.get('/', userController.status)
    router.post(
        '/login',
        [
            body('username').trim().isEmail().withMessage('Please enter a valid email.'), body('password').trim().isLength({ min: 5 })
        ],
        authController.login
    );

    router.get('/users', isGuarded, userController.allUsers)
    router.get('/user/:userId', isGuarded, userController.user)
    router.post('/user/create', [
        body('username').isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ username: value }).then(user => {
                    if (user) {
                        return Promise.reject('E-mail already exists')
                    }
                })
            })
            .normalizeEmail(),
        body('password').trim().isLength({ min: 5 }),
        body('name').trim().not().notEmpty()

    ], userController.createUser);

    router.put('/user/:userId', isGuarded, userController.updateUser)
    router.delete('/user/:userId', isGuarded, userController.deleteUser)
}

