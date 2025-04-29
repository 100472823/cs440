const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/create', playlistController.createPlaylist);
router.get('/user/:username', playlistController.getUserPlaylists);
router.post('/add', playlistController.addSongToPlaylist);
router.post('/remove', playlistController.removeSongFromPlaylist);
router.post('/delete', playlistController.deletePlaylist);
router.get('/:username/:playlistId', playlistController.getSongsInPlaylist);

module.exports = router;
