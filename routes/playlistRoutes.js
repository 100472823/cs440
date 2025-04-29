const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const Playlist = require('../models/Playlist');
const { User, readDatabase } = require('../models/User');

// Create Playlist
router.post('/create', async (req, res) => {
  const { username, name } = req.body;
  try {
    const newPlaylist = await User.createPlaylist(username, name);
    res.json({ success: true, playlist: newPlaylist });
  } catch (error) {
    console.error("❌ Error creating playlist:", error);
    res.status(500).json({ error: error.message || 'Error creating playlist.' });
  }
});

// Get all playlists for a user
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.getUser(username);
    if (!user || !user.playlists) {
      return res.json([]);
    }
    res.json(user.playlists);
  } catch (error) {
    console.error("❌ Error fetching user playlists:", error);
    res.status(500).json({ error: 'Error fetching playlists.' });
  }
});

// Add Song to Playlist
router.post('/add', async (req, res) => {
  const { username, playlistId, songId } = req.body;
  try {
    const updatedPlaylist = await Playlist.addSong(username, playlistId, songId);
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    console.error("❌ Error adding song:", error);
    res.status(500).json({ error: error.message || 'Error adding song to playlist.' });
  }
});

// Remove Song from Playlist
router.post('/remove', async (req, res) => {
  const { username, playlistId, songId } = req.body;
  try {
    const updatedPlaylist = await Playlist.removeSong(username, playlistId, songId);
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    console.error("❌ Error removing song:", error);
    res.status(500).json({ error: error.message || 'Error removing song from playlist.' });
  }
});

// Delete Playlist
router.post('/delete', async (req, res) => {
  const { username, playlistId } = req.body;
  try {
    const users = await readDatabase();
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    user.playlists = user.playlists.filter(p => p.id !== playlistId && p.name !== playlistId);

    await fs.writeFile(
      path.resolve(__dirname, '../database/database.json'), 
      JSON.stringify(users, null, 2)
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting playlist:", error);
    res.status(500).json({ error: error.message || 'Error deleting playlist.' });
  }
});

// Get Songs from Playlist
router.get('/:username/:playlistId', async (req, res) => {
  const { username, playlistId } = req.params;
  try {
    const songs = await Playlist.getSongsInPlaylist(username, playlistId);
    res.json(songs);
  } catch (error) {
    console.error("❌ Error getting playlist songs:", error);
    res.status(500).json({ error: error.message || 'Error getting playlist songs.' });
  }
});

// Shuffle Playlist
router.get('/shuffle/:playlistId', async (req, res) => {
  try {
    const shuffledPlaylist = await Playlist.shuffle(req.params.playlistId);
    res.json(shuffledPlaylist);
  } catch (error) {
    console.error("❌ Error shuffling playlist:", error);
    res.status(500).json({ error: 'Error shuffling playlist.' });
  }
});

module.exports = router;
