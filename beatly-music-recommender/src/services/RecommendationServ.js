const { getAllSongs } = require('../repositories/SongRepository');

function recommendSongsByGenre(genre) {
  const songs = getAllSongs();
  return songs.filter(song => song.genre === genre);
}

module.exports = { recommendSongsByGenre };
