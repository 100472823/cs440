const { User } = require('../models/User');
const beatlyEmitter = require('../events/beatlyEvents');


const dbPath = path.resolve(__dirname, '../database/database.json');


// Get all playlists for a user
const getUserPlaylists = async (req, res) => {
  try {
    const user = await User.getUser(req.params.username);
    if (!user || !user.playlists) {
      return res.json([]);
    }
    beatlyEmitter.emit('playlistsRetrieved', { username: req.params.username });
    res.json(user.playlists);
  } catch (error) {
    console.error("❌ Error retrieving user playlists:", error);
    res.status(500).json({ error: 'Error retrieving playlists.' });
  }
};

module.exports = {
  getUserPlaylists
};
