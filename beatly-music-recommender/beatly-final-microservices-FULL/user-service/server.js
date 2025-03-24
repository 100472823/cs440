// user-service/server.js
const express = require('express');
const app = express();
const PORT = 3001;

// Simulated JSON-based DB for users
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'database.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility to read/write the database.json
function readDatabase() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
function writeDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// ---------------------- USER ROUTES ----------------------
// User Signup
app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const database = readDatabase();

  // Check if user already exists
  const existingUser = database.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  // Add new user
  database.push({ username, password, likedSongs: [], playlists: [] });
  writeDatabase(database);
  
  res.json({ success: true, message: 'User registered successfully!' });
});

// User Login
app.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  const database = readDatabase();

  const user = database.find(u => u.username === username && u.password === password);
  if (user) {
    return res.json({ success: true, message: 'Login successful.' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }
});

// Like a Song
app.post('/users/like', (req, res) => {
  const { username, songTitle } = req.body;
  const database = readDatabase();

  const user = database.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!user.likedSongs) {
    user.likedSongs = [];
  }

  // Avoid duplicates
  if (!user.likedSongs.includes(songTitle)) {
    user.likedSongs.push(songTitle);
  }
  writeDatabase(database);

  res.json({ success: true, message: 'Song liked successfully!' });
});

// Unlike a Song
app.post('/users/unlike', (req, res) => {
  const { username, songTitle } = req.body;
  const database = readDatabase();

  const user = database.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  user.likedSongs = (user.likedSongs || []).filter(song => song !== songTitle);
  writeDatabase(database);

  res.json({ success: true, message: 'Song unliked successfully!' });
});

// Get a user’s liked songs
app.get('/users/:username/liked', (req, res) => {
  const { username } = req.params;
  const database = readDatabase();

  const user = database.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json(user.likedSongs || []);
});

// Create a playlist
app.post('/users/:username/playlists', (req, res) => {
  const { username } = req.params;
  const { playlistName } = req.body;
  
  const database = readDatabase();
  const user = database.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!user.playlists) {
    user.playlists = [];
  }

  const newPlaylist = {
    id: Date.now().toString(),
    name: playlistName,
    songs: []
  };
  user.playlists.push(newPlaylist);

  writeDatabase(database);
  res.json({ success: true, playlist: newPlaylist });
});

// (You can add more playlist CRUD routes as needed)

// Start the User Service
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
