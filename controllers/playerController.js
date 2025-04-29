const beatlyEmitter = require('../events/beatlyEvents');
const MusicLibrary = require('../models/MusicLibrary');

// Get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await MusicLibrary.getAllSongs();
    beatlyEmitter.emit('songsRetrieved', { count: songs.length });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving songs.' });
  }
};

// Find songs by genre
const findSongByGenre = async (req, res) => {
  try {
    const songs = await MusicLibrary.findSongByGenre(req.params.genre);
    beatlyEmitter.emit('songByGenreRetrieved', { genre: req.params.genre });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving songs by genre.' });
  }
};

// Find songs by artist
const findSongByArtist = async (req, res) => {
  try {
    const songs = await MusicLibrary.findSongByArtist(req.params.artist);
    beatlyEmitter.emit('songByArtistRetrieved', { artist: req.params.artist });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving songs by artist.' });
  }
};

module.exports = {
  getAllSongs,
  findSongByGenre,
  findSongByArtist
};
