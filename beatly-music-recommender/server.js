const express = require('express');
const app = express();
const PORT = 5500;

// Import Models
const User = require('./src/models/User.js');
const MusicLibrary = require('./src/models/MusicLibrary.js');
const Playlist = require('./src/models/Playlist.js');
const RecommenderEngine = require('./src/models/RecommendationEngine.js');




app.use(express.static(__dirname + '/public'));

app.use('/client', express.static(__dirname + '/client'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------- USER ROUTES ----------------------

// User Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    try {
        const result = await User.register(username, password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error processing signup.' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const valid = await User.validateCredentials(username, password);
        if (valid) {
            return res.json({ success: true });
        }
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
    } catch (error) {
        res.status(500).json({ error: 'Error processing login.' });
    }
});

// Like a Song
app.post('/user/like', async (req, res) => {
    const { username, songId } = req.body;
    try {
        await User.likeSong(username, songId);
        res.json({ success: true, message: 'Song liked successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error liking the song.' });
    }
});

// ---------------------- SONG ROUTES ----------------------

// Get All Songs
app.get('/songs', async (req, res) => {
    try {
        const songs = await MusicLibrary.getAllSongs();

        if (!Array.isArray(songs)) {
            console.error("ERROR: Expected an array but got:", songs);
            return res.status(500).json({ error: "Internal Server Error: Invalid songs data." });
        }

        console.log("🎵 Sending all songs:", songs);
        res.json(songs);
    } catch (error) {
        console.error('Error retrieving songs:', error);
        res.status(500).json({ error: 'Error retrieving songs.' });
    }
});

// Find Song by Genre
app.get('/database/songs/genre/:genre', async (req, res) => {
    try {
        const songs = await MusicLibrary.findSongByGenre(req.params.genre);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving songs by genre.' });
    }
});

// Find Song by Artist
app.get('/database/songs/artist/:artist', async (req, res) => {
    try {
        const songs = await MusicLibrary.findSongByArtist(req.params.artist);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving songs by artist.' });
    }
});

// ---------------------- PLAYLIST ROUTES ----------------------

// Create Playlist
app.post('/playlist/create', async (req, res) => {
    const { username, name } = req.body;
    try {
        const newPlaylist = await User.createPlaylist(username, name);
        res.json({ success: true, playlist: newPlaylist });
    } catch (error) {
        res.status(500).json({ error: 'Error creating playlist.' });
    }
});

// Add Song to Playlist
app.post('/playlist/add', async (req, res) => {
    const { username, playlistId, songId } = req.body;
    try {
        const updatedPlaylist = await Playlist.addSong(username, playlistId, songId);
        res.json({ success: true, playlist: updatedPlaylist });
    } catch (error) {
        res.status(500).json({ error: 'Error adding song to playlist.' });
    }
});

// Remove Song from Playlist
app.post('/playlist/remove', async (req, res) => {
    const { username, playlistId, songId } = req.body;
    try {
        const updatedPlaylist = await Playlist.removeSong(username, playlistId, songId);
        res.json({ success: true, playlist: updatedPlaylist });
    } catch (error) {
        res.status(500).json({ error: 'Error removing song from playlist.' });
    }
});

// Shuffle Playlist
app.get('/playlist/shuffle/:playlistId', async (req, res) => {
    try {
        const shuffledPlaylist = await Playlist.shuffle(req.params.playlistId);
        res.json(shuffledPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Error shuffling playlist.' });
    }
});

// ---------------------- RECOMMENDATION ROUTES ----------------------

// Get Recommendations for User
app.get('/recommendations/:username', async (req, res) => {
    try {
        const recommendations = await RecommenderEngine.generateRecommendations(req.params.username);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Error generating recommendations.' });
    }
});

// Get Trending Songs
app.get('/recommendations/trending', async (req, res) => {
    try {
        const trendingSongs = await RecommenderEngine.getTrendingSongs();
        res.json(trendingSongs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving trending songs.' });
    }
});

// start server
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
