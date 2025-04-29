// src/controllers/playlistController.js
const Playlist = require('../models/Playlist');
const { readDatabase } = require('../models/User');
const path = require('path');
const fs = require('fs').promises;

exports.createPlaylist = async (req, res) => {
    const { username, name } = req.body;
    try {
        const { User } = require('../models/User');
        const newPlaylist = await User.createPlaylist(username, name);
        res.json({ success: true, playlist: newPlaylist });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error creating playlist.' });
    }
};

exports.getUserPlaylists = async (req, res) => {
    const { username } = req.params;
    try {
        const users = await readDatabase();
        const user = users.find(u => u.username === username);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user.playlists || []);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching playlists.' });
    }
};

exports.addSongToPlaylist = async (req, res) => {
    const { username, playlistId, songId } = req.body;
    try {
        const updatedPlaylist = await Playlist.addSong(username, playlistId, songId);
        res.json({ success: true, playlist: updatedPlaylist });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error adding song to playlist.' });
    }
};

exports.removeSongFromPlaylist = async (req, res) => {
    const { username, playlistId, songId } = req.body;
    try {
        const updatedPlaylist = await Playlist.removeSong(username, playlistId, songId);
        res.json({ success: true, playlist: updatedPlaylist });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error removing song from playlist.' });
    }
};

exports.deletePlaylist = async (req, res) => {
    const { username, playlistId } = req.body;
    try {
        const users = await readDatabase();
        const user = users.find(u => u.username === username);
        if (!user) throw new Error('User not found');

        user.playlists = user.playlists.filter(p => p.id !== playlistId && p.name !== playlistId);

        await fs.writeFile(
            path.join(__dirname, '../../database/database.json'),
            JSON.stringify(users, null, 2)
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error deleting playlist.' });
    }
};

exports.getSongsInPlaylist = async (req, res) => {
    const { username, playlistId } = req.params;
    try {
        const songs = await Playlist.getSongsInPlaylist(username, playlistId);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error getting playlist songs.' });
    }
};
