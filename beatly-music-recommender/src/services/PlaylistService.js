const { getAllPlaylists } = require('../repositories/PlaylistRepository');

function getPlaylists() {
  return getAllPlaylists();
}

// You can later add: createPlaylist, addSongToPlaylist, etc.

module.exports = { getPlaylists };
