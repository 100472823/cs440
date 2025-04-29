// src/controllers/userController.js
const { User } = require('../models/User');

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    try {
        const result = await User.register(username, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error processing signup.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const valid = await User.validateCredentials(username, password);
        if (valid) {
            return res.json({ success: true });
        }
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
    } catch (error) {
        res.status(500).json({ error: 'Error processing login.' });
    }
};

exports.likeSong = async (req, res) => {
    const { username, songId } = req.body;
    try {
        await User.likeSongInDb(username, songId);
        res.json({ success: true, message: 'Song liked successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error liking the song.' });
    }
};

exports.unlikeSong = async (req, res) => {
    const { username, songId } = req.body;
    try {
        await User.unlikeSong(username, songId);
        res.json({ success: true, message: 'Song unliked successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error unliking the song.' });
    }
};

exports.getLikedSongs = async (req, res) => {
    try {
        const likedSongs = await User.getLikedSongs(req.params.username);
        res.json(likedSongs);
    } catch (error) {
        res.status(500).json({ error: 'Error getting liked songs.' });
    }
};
