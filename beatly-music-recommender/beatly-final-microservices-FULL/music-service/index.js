// music-service/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3002;

// Load the songs data
const songsPath = path.join(__dirname, 'songs.json');
function readSongs() {
  return JSON.parse(fs.readFileSync(songsPath, 'utf8'));
}

app.use(express.json());

// Get all songs
app.get('/music/songs', (req, res) => {
  try {
    const songs = readSongs();
    res.json(songs);
  } catch (error) {
    console.error('Error reading songs:', error);
    res.status(500).json({ error: 'Error retrieving songs.' });
  }
});

// Find songs by genre
app.get('/music/songs/genre/:genre', (req, res) => {
  const { genre } = req.params;
  try {
    const songs = readSongs().filter(song => 
      song.genre.toLowerCase() === genre.toLowerCase()
    );
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving songs by genre.' });
  }
});

// Find songs by artist
app.get('/music/songs/artist/:artist', (req, res) => {
  const { artist } = req.params;
  try {
    const songs = readSongs().filter(song => 
      song.artist.toLowerCase() === artist.toLowerCase()
    );
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving songs by artist.' });
  }
});

// Start the Music Service
app.listen(PORT, () => {
  console.log(`Music Service running on port ${PORT}`);
});
