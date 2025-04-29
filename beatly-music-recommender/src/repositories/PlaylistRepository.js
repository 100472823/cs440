const playlists = require('../../database/playlists.json');

function getAllPlaylists() {
  return playlists;
}

// Later, you can add more methods like savePlaylist, deletePlaylist, etc.

module.exports = { getAllPlaylists };
