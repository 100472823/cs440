// user-service/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Database JSON path
const dbPath = path.join(__dirname, "database.json");

// Helpers to read/write JSON
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}

app.use(express.json());

// -------------------- 1) Signup --------------------
app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }
  const db = readDB();
  const existing = db.find((u) => u.username === username);
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  const newUser = {
    username,
    password,
    likedSongs: [],
    playlists: [],
  };
  db.push(newUser);
  writeDB(db);
  res.json({ success: true, message: "User registered successfully" });
});

// -------------------- 2) Login --------------------
app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
  res.json({ success: true, message: "Login successful" });
});

// -------------------- 3) Like a Song --------------------
// POST /users/like  => body: { username, songId }
app.post("/users/like", (req, res) => {
  const { username, songId } = req.body;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.likedSongs = user.likedSongs || [];
  if (!user.likedSongs.includes(songId)) {
    user.likedSongs.push(songId);
  }
  writeDB(db);
  res.json({ success: true, message: "Song liked!", likedSongs: user.likedSongs });
});

// -------------------- 4) Unlike a Song --------------------
app.post("/users/unlike", (req, res) => {
  const { username, songId } = req.body;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.likedSongs = user.likedSongs.filter((title) => title !== songId);
  writeDB(db);
  res.json({ success: true, message: "Song unliked", likedSongs: user.likedSongs });
});

// -------------------- 5) Get Liked Songs --------------------
// GET /users/:username/liked
app.get("/users/:username/liked", (req, res) => {
  const { username } = req.params;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // user.likedSongs is presumably an array of song titles
  res.json(user.likedSongs || []);
});

// -------------------- 6) Playlists: get all user's playlists --------------------
// GET /users/:username/playlists
app.get("/users/:username/playlists", (req, res) => {
  const { username } = req.params;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user.playlists || []);
});

// -------------------- 7) Playlists: create a playlist --------------------
// POST /users/:username/playlists  => body: { name }
app.post("/users/:username/playlists", (req, res) => {
  const { username } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "playlist name is required" });
  }
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const newPlaylist = {
    id: Date.now().toString(),
    name,
    songs: [],
  };
  user.playlists.push(newPlaylist);
  writeDB(db);
  res.json({ success: true, playlist: newPlaylist });
});

// -------------------- 8) Playlists: get songs from a specific playlist --------------------
// GET /users/:username/playlists/:playlistId
app.get("/users/:username/playlists/:playlistId", (req, res) => {
  const { username, playlistId } = req.params;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const playlist = (user.playlists || []).find((p) => p.name === playlistId || p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }
  // playlist.songs is presumably an array of song titles (or objects).
  res.json(playlist.songs || []);
});

// -------------------- 9) Playlists: add a song to a playlist --------------------
// POST /users/:username/playlists/:playlistId/songs => body: { songId }
app.post("/users/:username/playlists/:playlistId/songs", (req, res) => {
  const { username, playlistId } = req.params;
  const { songId } = req.body;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const playlist = user.playlists.find((p) => p.name === playlistId || p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }
  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
  }
  writeDB(db);
  res.json({ success: true, playlist });
});

// -------------------- 10) Playlists: remove a song from a playlist --------------------
// DELETE /users/:username/playlists/:playlistId/songs => body: { songId }
app.delete("/users/:username/playlists/:playlistId/songs", (req, res) => {
  const { username, playlistId } = req.params;
  const { songId } = req.body; // in a real DELETE you might pass as query param or similar
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const playlist = user.playlists.find((p) => p.name === playlistId || p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }
  playlist.songs = playlist.songs.filter((s) => s !== songId);
  writeDB(db);
  res.json({ success: true, message: `Song ${songId} removed` });
});

// -------------------- 11) Playlists: delete entire playlist --------------------
// DELETE /users/:username/playlists/:playlistId
app.delete("/users/:username/playlists/:playlistId", (req, res) => {
  const { username, playlistId } = req.params;
  const db = readDB();
  const user = db.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.playlists = user.playlists.filter(
    (p) => p.name !== playlistId && p.id !== playlistId
  );
  writeDB(db);
  res.json({ success: true, message: `Playlist ${playlistId} deleted` });
});

// Start the User Service
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
