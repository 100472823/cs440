const RecommendationEngine = require('../models/RecommendationEngine');
const { User } = require('../models/User');
const MusicLibrary = require('../models/MusicLibrary');

const recommender = new RecommendationEngine(); // Create an instance

exports.generateRecommendations = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.getUser(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const recommendations = await recommender.generateRecommendations(user, MusicLibrary);
        res.json(recommendations);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Error generating recommendations' });
    }
};

exports.getTrendingSongs = async (req, res) => {
    try {
        const trendingSongs = await recommender.getTrendingSongs(MusicLibrary);
        res.json(trendingSongs);
    } catch (error) {
        console.error('Error retrieving trending songs:', error);
        res.status(500).json({ error: 'Error retrieving trending songs' });
    }
};
