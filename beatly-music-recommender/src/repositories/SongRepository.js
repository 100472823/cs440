const songs = require('../../database/songs.json');

function getAllSongs() {
  return songs;
}

module.exports = { getAllSongs };
