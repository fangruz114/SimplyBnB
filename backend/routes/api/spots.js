const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');
const router = express.Router();

const validateSpotInput = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isNumeric()
        .custom(v => v >= -90 && v <= 90)
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isNumeric()
        .custom(v => v >= -180 && v <= 180)
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReviewInput = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isNumeric()
        .custom(v => v >= 1 && v <= 5)
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateBookingInput = [
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date is required')
        .isDate()
        .not()
        .isBefore(new Date().toISOString().split('T')[0])
        .withMessage('Invalid start date'),
    // .custom(async (value, { req }) => {
    //     const bookings = await Booking.findAll({
    //         where: {
    //             spotId: req.params.id,
    //             stDate: { [Op.lt]: new Date(req.body.endDate) },
    //             edDate: { [Op.gt]: new Date(req.body.startDate) }
    //         },
    //     });
    //     if (!bookings.length) return true;
    //     else return false;
    // })
    // .withMessage('Start date conflicts with an existing booking'),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required')
        .isDate()
        .isAfter(new Date().toISOString().split('T')[0])
        .withMessage('Invalid end date'),
    handleValidationErrors
];

const verifySpotId = async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.id);
    if (!spot) {
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        err.message = 'Spot couldn\'t be found';
        err.title = 'Spot couldn\'t be found';
        next(err);
    }
    next();
};

const verifySpotOwner = async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.id);
    if (req.user.id != spot.ownerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }
    next();
};

const verifyBookingSchedule = async (req, res, next) => {
    const bookings = await Booking.findAll({
        where: { spotId: req.params.id },
        order: [['stDate']]
    });
    let i = 0;
    while (Date.parse(bookings[i].stDate) < Date.parse(req.body.endDate)) {
        const currentBooking = bookings[i];
        if (Date.parse(currentBooking.stDate) < Date.parse(req.body.endDate)
            && Date.parse(currentBooking.edDate) > Date.parse(req.body.startDate)) {
            const err = new Error('Sorry, this spot is already booked for the specified dates');
            err.status = 403;
            err.title = "Sorry, this spot is already booked for the specified dates";
            err.message = "Sorry, this spot is already booked for the specified dates";
            err.errors = {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
            next(err);
        }
        i++;
    }
    next();
};

router.post('/:id/bookings', requireAuth, verifySpotId, validateBookingInput, verifyBookingSchedule, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.id);
    if (req.user.id == spot.ownerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }
    const { startDate, endDate } = req.body;
    const newBooking = await Booking.create({
        spotId: req.params.id,
        userId: req.user.id,
        stDate: startDate,
        edDate: endDate,
    });
    const { id, spotId, userId, stDate, edDate, createdAt, updatedAt } = newBooking;
    return res.json({
        id,
        spotId,
        userId,
        startDate: stDate,
        endDate: edDate,
        createdAt,
        updatedAt
    });
});

router.get('/:id/bookings', requireAuth, verifySpotId, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    if (req.user.id == spot.ownerId) {
        const bookings = await Booking.findAll({
            where: { spotId: req.params.id },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }],
            attributes: [
                'id',
                'spotId',
                'userId',
                [sequelize.fn('strftime', sequelize.col('stDate')), 'startDate'],
                [sequelize.fn('strftime', sequelize.col('edDate')), 'endDate'],
                'createdAt',
                'updatedAt',
            ]
        });
        return res.json({ Bookings: bookings });
    } else {
        const bookingsNotOwner = await Booking.findAll({
            where: {
                spotId: req.params.id,
                userId: req.user.id
            },
            attributes: [
                'spotId',
                [sequelize.fn('strftime', sequelize.col('stDate')), 'startDate'],
                [sequelize.fn('strftime', sequelize.col('edDate')), 'endDate']
            ]
        });
        return res.json({ Bookings: bookingsNotOwner });
    }
});

router.post('/:id/reviews', requireAuth, validateReviewInput, verifySpotId, async (req, res, next) => {
    const reviewSpot = await Review.findAll({
        where: {
            spotId: req.params.id,
            userId: req.user.id
        }
    });
    console.log(reviewSpot);
    if (reviewSpot.length) {
        const err = new Error('User already has a review for this spot');
        err.status = 403;
        err.message = 'User already has a review for this spot';
        err.title = 'User already has a review for this spot';
        next(err);
    } else {
        const { review, stars } = req.body;
        const newReview = await Review.create({
            userId: req.user.id,
            spotId: req.params.id,
            review,
            stars,
        });
        return res.json(newReview);
    }
});

router.get('/:id/reviews', verifySpotId, async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { spotId: req.params.id },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }, {
                model: Image,
                attributes: ['url']
            }]
        });
        return res.json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verifySpotId, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id, {
        include: [{
            model: Review,
            attributes: [],
        }, {
            model: Image,
            attributes: ['url']
        }, {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
        }],
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
            [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews'],
            [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating']
        ],
    });
    return res.json(spot);
});

router.put('/:id', requireAuth, validateSpotInput, verifySpotId, verifySpotOwner, async (req, res,) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotToUpdate = await Spot.findByPk(req.params.id);
    spotToUpdate.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });
    return res.json(spotToUpdate);
});

router.delete('/:id', requireAuth, verifySpotId, verifySpotOwner, async (req, res, next) => {
    const spotToDelete = await Spot.findByPk(req.params.id);
    try {
        await spotToDelete.destroy();
        res.status(200);
        return res.json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        });
    } catch (e) {
        next(e);
    }
});

router.post('/', requireAuth, validateSpotInput, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });
    return res.json(newSpot);
});

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json({ Spots: spots });
});

module.exports = router;
