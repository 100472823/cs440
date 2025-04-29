const beatlyEmitter = require('../events/beatlyEvents');
const RecommenderEngine = require('../models/RecommendationEngine');

// Generate user recommendations
const generateRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommenderEngine.generateRecommendations(req.params.username);
    beatlyEmitter.emit('recommendationsGenerated', { username: req.params.username });
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Error generating recommendations.' });
  }
};

// Get trending songs
const getTrendingSongs = async (req, res) => {
  try {
    const trendingSongs = await RecommenderEngine.getTrendingSongs();
    beatlyEmitter.emit('trendingSongsRetrieved');
    res.json(trendingSongs);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving trending songs.' });
  }
};

module.exports = {
  generateRecommendations,
  getTrendingSongs
};
