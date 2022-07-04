const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User, Review, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



module.exports = router;
