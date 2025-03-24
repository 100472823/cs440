// music-service/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3002;

// Songs stored in songs.json
const songsPath = path.join(__dirname, "songs.json");

function loadSongs() {
  return JSON.parse(fs.readFileSync(songsPath, "utf8"));
}

app.use(express.json());

// GET /music/songs
app.get("/music/songs", (req, res) => {
  try {
    const songs = loadSongs();
    res.json(songs);
  } catch (err) {
    console.error("Error reading songs:", err);
    res.status(500).json({ error: "Failed to load songs" });
  }
});

// GET /music/songs/artist/:artist
app.get("/music/songs/artist/:artist", (req, res) => {
  const allSongs = loadSongs();
  const filtered = allSongs.filter(
    (s) => s.artist.toLowerCase() === req.params.artist.toLowerCase()
  );
  res.json(filtered);
});

// GET /music/songs/genre/:genre
app.get("/music/songs/genre/:genre", (req, res) => {
  const allSongs = loadSongs();
  const filtered = allSongs.filter(
    (s) => s.genre.toLowerCase() === req.params.genre.toLowerCase()
  );
  res.json(filtered);
});

// Start the Music Service
app.listen(PORT, () => {
  console.log(`Music Service running on port ${PORT}`);
});
