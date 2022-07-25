const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Image, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required'),
    // check('username')
    //     .not()
    //     .isEmail()
    //     .withMessage('Username cannot be an email.'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

const verifyUserId = async (req, res, next) => {
    let user = await User.findByPk(req.params.id);
    if (!user) {
        const err = new Error('User couldn\'t be found');
        err.status = 404;
        err.message = 'User couldn\'t be found';
        err.title = 'User couldn\'t be found';
        next(err);
    }
    next();
};

const verifyOwner = async (req, res, next) => {
    if (req.user.id != req.params.id) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }
    next();
};

router.get('/:id/bookings', requireAuth, verifyUserId, verifyOwner, async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.params.id },
            attributes: [
                'id',
                'spotId',
                'userId',
                ['stDate', 'startDate'],
                ['edDate', 'endDate'],
                'createdAt',
                'updatedAt'
            ],
            include: [{
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    'previewImage']
            }]
        });
        return res.json({ Bookings: bookings })
    } catch (err) {
        next(err);
    }
});

router.get('/:id/reviews', requireAuth, verifyUserId, verifyOwner, async (req, res) => {
    const reviews = await Review.findAll({
        where: { userId: req.params.id },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
        }, {
            model: Image,
            attributes: ['url']
        }]
    });
    res.json({ Reviews: reviews });
});

router.get('/:id/spots', requireAuth, verifyUserId, verifyOwner, async (req, res) => {
    const spots = await Spot.findAll({
        where: { ownerId: req.params.id }
    });
    return res.json({ Spots: spots });
});

router.post('/', validateSignup, async (req, res, next) => {
    const userExist = await User.findOne({
        where: { email: req.body.email }
    });
    if (userExist) {
        const err = new Error('User already exists');
        err.status = 403;
        err.title = "User already exists";
        err.message = "User already exists";
        err.errors = { email: "User with that email already exists" }
        next(err);
    }
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    const token = await setTokenCookie(res, user);
    const currentUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
    }
    return res.json(currentUser);
});


module.exports = router;
