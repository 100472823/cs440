// src/routes/songRoutes.js
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.getAllSongs);
router.get('/genre/:genre', songController.findSongByGenre);
router.get('/artist/:artist', songController.findSongByArtist);

module.exports = router;
