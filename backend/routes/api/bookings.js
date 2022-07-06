const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, verifyBookingSchedule, validateBookingInput } = require('../../utils/validation');

const router = express.Router();

const verifyBookingId = async (req, res, next) => {
    let booking = await Booking.findByPk(req.params.id);
    if (!booking) {
        const err = new Error('Booking couldn\'t be found');
        err.status = 404;
        err.message = 'Booking couldn\'t be found';
        err.title = 'Booking couldn\'t be found';
        next(err);
    }
    next();
};

const pastBookings = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.id, {
        attributes: [
            ['stDate', 'startDate'],
            ['edDate', 'endDate'],
        ]
    });
    if (Date.parse(booking.dataValues.endDate) < Date.parse(new Date().toUTCString())) {
        const err = new Error('Past bookings can\'t be modified');
        err.status = 400;
        err.message = 'Past bookings can\'t be modified';
        err.title = 'Past bookings can\'t be modified';
        next(err);
    }
    next();
};

const verifyNonAllowedDeletingBookings = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.id, {
        attributes: [
            ['stDate', 'startDate'],
            ['edDate', 'endDate'],
        ]
    });
    if (Date.parse(booking.dataValues.startDate) < Date.parse(new Date().toUTCString())) {
        const err = new Error('Bookings that have been started can\'t be deleted');
        err.status = 400;
        err.message = 'Bookings that have been started can\'t be deleted';
        err.title = 'Bookings that have been started can\'t be deleted';
        next(err);
    }
    next();
};

const verifyBookingOwner = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.id);
    if (req.user.id != booking.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }
    next();
};

const verifyBookingAccessibility = async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.id);
    const bookingSpot = await Spot.findByPk(booking.spotId);
    if (req.user.id != booking.userId && bookingSpot.ownerId != req.user.id) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }
    next();
};

router.put('/:id', requireAuth, verifyBookingId, verifyBookingOwner, pastBookings, validateBookingInput, verifyBookingSchedule, async (req, res, next) => {
    try {
        const bookingToUpdate = await Booking.findByPk(req.params.id);
        const { startDate, endDate } = req.body;
        await bookingToUpdate.update({
            stDate: startDate,
            edDate: endDate,
        });
        const { id, spotId, userId, stDate, edDate, createdAt, updatedAt } = bookingToUpdate
        return res.json({
            id,
            spotId,
            userId,
            startDate: stDate,
            endDate: edDate,
            createdAt,
            updatedAt
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', requireAuth, verifyBookingId, verifyBookingAccessibility, verifyNonAllowedDeletingBookings, async (req, res, next) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        await booking.destroy();
        return res.json({
            message: 'Successfully deleted',
            statusCode: res.statusCode,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
