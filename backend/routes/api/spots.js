const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isNumeric()
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

const verifySpotId = async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.id);
    if (!spot) {
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        err.message = 'Spot couldn\'t be found';
        err.title = 'Spot couldn\'t be found';
        err.error = ['Spot couldn\'t be found'];
        next(err);
    }
    next();
}

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
