const express = require('express');
const router = express.Router();
const { getAllSongs, findSongByGenre, findSongByArtist } = require('../controllers/playerController');

router.get('/', getAllSongs);
router.get('/genre/:genre', findSongByGenre);
router.get('/artist/:artist', findSongByArtist);

module.exports = router;
