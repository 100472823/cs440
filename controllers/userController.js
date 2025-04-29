const beatlyEmitter = require('../events/beatlyEvents');
const { User } = require('../models/User');

// User signup
const signupUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }
  try {
    const result = await User.register(username, password);
    beatlyEmitter.emit('userSignedUp', { username });
    res.json(result);
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ error: 'Error processing signup.' });
  }
};

// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("🔐 Login attempt:", username, password);

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing username or password' });
  }

  try {
    const valid = await User.validateCredentials(username, password);
    if (valid) {
      beatlyEmitter.emit('userLoggedIn', { username });
      return res.json({ success: true });
    }
    res.status(401).json({ success: false, message: 'Invalid credentials.' });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: 'Error processing login.' });
  }
};

// Like a song
const likeSong = async (req, res) => {
  const { username, songId } = req.body;
  try {
    await User.likeSongInDb(username, songId);
    beatlyEmitter.emit('songLiked', { username, songId });
    res.json({ success: true, message: 'Song liked successfully!' });
  } catch (error) {
    console.error("❌ Like song error:", error);
    res.status(500).json({ error: 'Error liking the song.' });
  }
};

// Unlike a song
const unlikeSong = async (req, res) => {
  const { username, songId } = req.body;
  try {
    await User.unlikeSong(username, songId);
    beatlyEmitter.emit('songUnliked', { username, songId });
    res.json({ success: true, message: 'Song unliked successfully!' });
  } catch (error) {
    console.error("❌ Unlike song error:", error);
    res.status(500).json({ error: 'Error unliking the song.' });
  }
};

// Get liked songs
const getLikedSongs = async (req, res) => {
  try {
    const likedSongs = await User.getLikedSongs(req.params.username);
    beatlyEmitter.emit('likedSongsRetrieved', { username: req.params.username });
    res.json(likedSongs);
  } catch (error) {
    console.error("❌ Get liked songs error:", error);
    res.status(500).json({ error: 'Error getting liked songs.' });
  }
};

module.exports = {
  signupUser,
  loginUser,
  likeSong,
  unlikeSong,
  getLikedSongs
};
