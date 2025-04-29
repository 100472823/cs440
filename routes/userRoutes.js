const path = require('path');
const express = require('express');
const router = express.Router();
const { signupUser, loginUser, likeSong, unlikeSong, getLikedSongs } = require('../controllers/userController');


const dbPath = path.resolve(__dirname, '../../database/database.json');
const songsPath = path.resolve(__dirname, '../../database/songs.json');


router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/like', likeSong);
router.post('/unlike', unlikeSong);
router.get('/liked/:username', getLikedSongs);

module.exports = router;
