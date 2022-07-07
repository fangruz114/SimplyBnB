const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateImageInput } = require('../../utils/validation');

const router = express.Router();

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

const verifyReviewId = async (req, res, next) => {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
        const err = new Error('Review couldn\'t be found');
        err.status = 404;
        err.message = 'Review couldn\'t be found';
        err.title = 'Review couldn\'t be found';
        next(err);
    }
    next();
};

const verifyReviewOwner = async (req, res, next) => {
    const review = await Review.findByPk(req.params.id);
    if (req.user.id != review.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }
    next();
};

const verifyReviewImageMaxCount = async (req, res, next) => {
    const images = await Image.findAll({
        where: {
            imageableType: 'Review',
            reviewId: req.params.id,
        }
    });
    if (images.length >= 10) {
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 400;
        err.title = "Maximum number of images for this resource was reached";
        err.message = "Maximum number of images for this resource was reached";
        next(err);
    }
    next();
};

router.post('/:id/images', requireAuth, verifyReviewId, verifyReviewOwner, verifyReviewImageMaxCount, validateImageInput, async (req, res, next) => {
    try {
        const newImage = await Image.create({
            reviewId: req.params.id,
            imageableType: "Review",
            url: req.body.url
        });
        return res.json(await Image.findByPk(newImage.id, {
            attributes: [
                'id',
                ['reviewId', 'imageableId'],
                'imageableType',
                'url'
            ]
        }));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', requireAuth, validateReviewInput, verifyReviewId, verifyReviewOwner, async (req, res, next) => {
    const { review, stars } = req.body;
    try {
        const reviewToUpdate = await Review.findByPk(req.params.id);
        await reviewToUpdate.update({
            review,
            stars,
        });
        return res.json(reviewToUpdate);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', requireAuth, verifyReviewId, verifyReviewOwner, async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);
        await review.destroy();
        return res.json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
