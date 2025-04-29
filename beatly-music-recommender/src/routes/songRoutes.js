const express = require('express');
const router = express.Router();
const { getRecommendedSongs } = require('../controllers/PlayerController');

router.get('/recommendations', getRecommendedSongs);

module.exports = router;
