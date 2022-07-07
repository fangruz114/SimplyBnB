const { validationResult } = require('express-validator');
const { Booking, Spot } = require('../db/models');
const { check } = require('express-validator');
const { Op } = require('sequelize');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach((error) => errors[error.param] = `${error.msg}`);

        const err = Error('Validation error');
        err.errors = errors;
        err.status = 400;
        err.title = 'Validation error';
        next(err);
    }
    next();
};

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

const verifyBookingSchedule = async (req, res, next) => {
    const bookingInd = await Booking.findByPk(req.params.id);
    const bookings = await Booking.findAll({
        where: {
            spotId: bookingInd.spotId,
            id: { [Op.notIn]: [req.params.id] },
            stDate: { [Op.lt]: new Date(req.body.endDate) },
            edDate: { [Op.gt]: new Date(req.body.startDate) },
        },
        order: [['stDate']],
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

    // alternative method to iteratate through
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
};

const validateImageInput = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage('Image url is required')
        .isURL()
        .withMessage('Invalid url'),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateBookingInput,
    verifyBookingSchedule,
    validateImageInput,
};
