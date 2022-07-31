const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateImageInput } = require('../../utils/validation');

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
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required')
        .isDate()
        .isAfter(new Date().toISOString().split('T')[0])
        .withMessage('Invalid end date'),
    handleValidationErrors
];

const validateQuerySearchInput = [
    check('page')
        .custom(v => v == undefined || v >= 0)
        .withMessage('Page must be greater than or equal to 0'),
    check('size')
        .custom(v => v == undefined || v > 0)
        .withMessage('Size must be greater than or equal to 0'),
    check('maxLat')
        .custom(v => v == undefined || (v >= -90 && v <= 90))
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .custom(v => v == undefined || (v >= -90 && v <= 90))
        .withMessage('Minimum latitude is invalid'),
    check('maxLng')
        .custom(v => v == undefined || (v >= -180 && v <= 180))
        .withMessage('Maximum longitude is invalid'),
    check('minLng')
        .custom(v => v == undefined || (v >= -180 && v <= 180))
        .withMessage('Minimum longitude is invalid'),
    check('minPrice')
        .custom(v => v == undefined || v > 0)
        .withMessage('Minimum price must be greater than 0'),
    check('maxPrice')
        .custom(v => v == undefined || v > 0)
        .withMessage('Maximum price must be greater than 0'),
    handleValidationErrors
]

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
    // const bookings = await Booking.findAll({
    //     where: { spotId: req.params.id },
    //     order: [['stDate']]
    // });
    // let i = 0;
    // while (i < bookings.length) {
    //     const currentBooking = bookings[i];
    //     if (Date.parse(currentBooking.stDate) < Date.parse(req.body.endDate)
    //         && Date.parse(currentBooking.edDate) > Date.parse(req.body.startDate)) {
    //         const err = new Error('Sorry, this spot is already booked for the specified dates');
    //         err.status = 403;
    //         err.title = "Sorry, this spot is already booked for the specified dates";
    //         err.message = "Sorry, this spot is already booked for the specified dates";
    //         err.errors = {
    //             "startDate": "Start date conflicts with an existing booking",
    //             "endDate": "End date conflicts with an existing booking"
    //         }
    //         next(err);
    //     }
    //     i++;
    // }
    // next();

    //alternative method
    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.id,
            stDate: { [Op.lt]: new Date(req.body.endDate) },
            edDate: { [Op.gt]: new Date(req.body.startDate) }
        },
    });
    if (bookings.length) {
        const err = new Error('Sorry, this spot is already booked for the specified dates');
        err.status = 403;
        err.title = "Sorry, this spot is already booked for the specified dates";
        err.message = "Sorry, this spot is already booked for the specified dates";
        err.errors = {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
        }
        next(err);
    };
    next();
};

const verifySpotImageMaxCount = async (req, res, next) => {
    const images = await Image.findAll({
        where: {
            imageableType: 'Spot',
            spotId: req.params.id,
        }
    });
    if (images.length >= 4) {
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 400;
        err.title = "Maximum number of images for this resource was reached";
        err.message = "Maximum number of images for this resource was reached";
        next(err);
    }
    next();
};

router.post('/:id/images', requireAuth, verifySpotId, verifySpotOwner, verifySpotImageMaxCount, validateImageInput, async (req, res, next) => {
    try {
        const newImage = await Image.create({
            spotId: req.params.id,
            imageableType: "Spot",
            url: req.body.url
        });
        return res.json(await Image.findByPk(newImage.id, {
            attributes: [
                'id',
                ['spotId', 'imageableId'],
                'imageableType',
                'url'
            ]
        }));
    } catch (err) {
        next(err);
    }
});

router.post('/:id/bookings', requireAuth, verifySpotId, validateBookingInput, verifyBookingSchedule, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.id);
    if (req.user.id == spot.ownerId) {
        const err = new Error('Spot owner is not allowed to book.');
        err.status = 403;
        err.title = "Spot owner is not allowed to book.";
        err.message = "Spot owner is not allowed to book.";
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
                ['stDate', 'startDate'],
                ['edDate', 'endDate'],
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
                'id',
                'spotId',
                ['stDate', 'startDate'],
                ['edDate', 'endDate'],
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
                attributes: ['id', 'url']
            }]
        });
        return res.json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', verifySpotId, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    const numReviews = await Review.count({
        where: { spotId: req.params.id }
    });
    const ratings = await Review.findAll({
        where: { spotId: req.params.id },
        attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']]
    });
    const images = await Image.findAll({
        where: { spotId: req.params.id },
        attributes: ['id', 'url']
    });
    const owners = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });

    const data = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        previewImage: spot.previewImage,
        numReviews,
        avgStarRating: parseFloat(ratings[0].dataValues.avgStarRating),
        images,
        Owners: owners
    }
    return res.json(data);
});

router.put('/:id', requireAuth, validateSpotInput, verifySpotId, verifySpotOwner, async (req, res,) => {
    const { address, city, state, country, lat, lng, name, description, price, previewImage } = req.body;
    const spotToUpdate = await Spot.findByPk(req.params.id);
    await spotToUpdate.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        previewImage,
    });
    return res.json(await Spot.findByPk(req.params.id));
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
    const { address, city, state, country, lat, lng, name, description, price, previewImage } = req.body;
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
        previewImage,
    });
    return res.json(await Spot.findByPk(newSpot.id));
});

router.get('/', validateQuerySearchInput, async (req, res) => {
    let query = {
        where: {},
    };

    const page = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const size = req.query.size === undefined ? 20 : parseInt(req.query.size);
    if (page >= 1 && size >= 1) {
        query.limit = size;
        query.offset = size * (page - 1);
    }

    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    if (minLat || maxLat) {
        const latCondition = [];
        query.where.lat = { [Op.and]: latCondition };
        if (minLat) {
            latCondition.push({ [Op.gte]: parseFloat(minLat) })
        }
        if (maxLat) {
            latCondition.push({ [Op.lte]: parseFloat(maxLat) });
        }
    }
    if (minLng || maxLng) {
        const lngCondition = [];
        query.where.lng = { [Op.and]: lngCondition };
        if (minLng) {
            lngCondition.push({ [Op.gte]: parseFloat(minLng) });
        }
        if (maxLng) {
            lngCondition.push({ [Op.lte]: parseFloat(maxLng) });
        }
    }
    if (minPrice || maxPrice) {
        const priceCondition = [];
        query.where.price = { [Op.and]: priceCondition };
        if (minPrice) {
            priceCondition.push({ [Op.gte]: parseFloat(minPrice) });
        }
        if (maxPrice) {
            priceCondition.push({ [Op.lte]: parseFloat(maxPrice) });
        }
    }
    const spots = await Spot.findAll(query);
    return res.json({ Spots: spots, page, size });
});

module.exports = router;
