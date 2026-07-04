const express = require('express');
const recommendationController = require('../controllers/recommendation.controller');

const router = express.Router();

router.post('/', recommendationController.getRecommendations);

module.exports = router;
