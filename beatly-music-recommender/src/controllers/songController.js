// src/controllers/songController.js
const MusicLibrary = require('../models/MusicLibrary');

exports.getAllSongs = async (req, res) => {
    try {
        const songs = await MusicLibrary.getAllSongs();
        if (!Array.isArray(songs)) {
            return res.status(500).json({ error: 'Internal Server Error: Invalid songs data.' });
        }
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving songs.' });
    }
};

exports.findSongByGenre = async (req, res) => {
    try {
        const songs = await MusicLibrary.findSongByGenre(req.params.genre);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving songs by genre.' });
    }
};

exports.findSongByArtist = async (req, res) => {
    try {
        const songs = await MusicLibrary.findSongByArtist(req.params.artist);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving songs by artist.' });
    }
};
