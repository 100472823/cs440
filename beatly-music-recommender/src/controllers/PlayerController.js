const { recommendSongsByGenre } = require('../services/RecommendationService');

function getRecommendedSongs(req, res) {
  const genre = req.query.genre;
  const songs = recommendSongsByGenre(genre);
  res.json(songs);
}

module.exports = { getRecommendedSongs };
