const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.get('/:username', recommendationController.generateRecommendations);
router.get('/trending', recommendationController.getTrendingSongs);

module.exports = router;
