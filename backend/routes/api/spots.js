const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.id);
    if (!spot) {
        const err = new Error('Spot couldn\'t be found');
        err.status = 404;
        err.message = 'Spot couldn\'t be found';
        err.title = 'Spot couldn\'t be found';
        err.error = ['Spot couldn\'t be found'];
        next(err);
    }
    spot = await Spot.findByPk(req.params.id, {
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

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json({ Spots: spots });
});

module.exports = router;
