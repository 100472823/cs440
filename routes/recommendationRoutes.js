const express = require('express');
const router = express.Router();
const { generateRecommendations, getTrendingSongs } = require('../controllers/recommendationController');

router.get('/:username', generateRecommendations);
router.get('/trending', getTrendingSongs);

module.exports = router;
