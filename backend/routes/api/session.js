const express = require('express');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.login({ credential, password });

    if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Invalid credentials';
        err.message = 'Invalid credentials';
        return next(err);
    };

    await setTokenCookie(res, user);

    const currentUser = await User.findByPk(user.id);

    return res.json(currentUser);
});

router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

router.get('/', restoreUser, requireAuth, (req, res) => {
    const { user } = req;
    if (user) {
        return res.json(user.toSafeObject());
    } else return res.json({});
});

module.exports = router;
