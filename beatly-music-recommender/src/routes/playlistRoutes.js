const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User'); // For createPlaylist

// Create Playlist
router.post('/create', async (req, res) => {
    console.log("📦 Received in /playlist/create:", req.body); 
  
    const { username, name } = req.body;
    try {
      const newPlaylist = await User.createPlaylist(username, name);
      res.json({ success: true, playlist: newPlaylist });
    } catch (error) {
      console.error("🚨 Error creating playlist:", error); 
      res.status(500).json({ error: error.message || 'Error creating playlist.' });
    }
  });

// Get all playlists for a user
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;
    try {
      const { readDatabase } = require('../models/User');
      const users = await readDatabase();
        
      const user = users.find(u => u.username === username);
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (!user.playlists) return res.json([]);
  
      res.json(user.playlists);
    } catch (error) {
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
    res.status(500).json({ error: error.message || 'Error removing song from playlist.' });
  }
});

// Get Songs from Playlist
router.get('/:username/:playlistId', async (req, res) => {
  const { username, playlistId } = req.params;
  try {
    const songs = await Playlist.getSongsInPlaylist(username, playlistId);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error getting playlist songs.' });
  }
});

// Shuffle Playlist
router.get('/shuffle/:playlistId', async (req, res) => {
  try {
    const shuffledPlaylist = await Playlist.shuffle(req.params.playlistId);
    res.json(shuffledPlaylist);
  } catch (error) {
    res.status(500).json({ error: 'Error shuffling playlist.' });
  }
});

module.exports = router;
