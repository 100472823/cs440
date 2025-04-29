// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/like', userController.likeSong);
router.post('/unlike', userController.unlikeSong);
router.get('/liked/:username', userController.getLikedSongs);

module.exports = router;
