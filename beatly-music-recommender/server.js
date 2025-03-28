const express = require('express');
const app = express();
const PORT = 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Models
const { User } = require('./src/models/User');
const MusicLibrary = require('./src/models/MusicLibrary.js');
//const Playlist = require('./src/models/Playlist.js');
const RecommenderEngine = require('./src/models/RecommendationEngine.js');
const playlistRoutes = require('./src/routes/playlistRoutes');



app.use('/playlist', playlistRoutes);

app.use(express.static(__dirname + '/public'));

app.use('/client', express.static(__dirname + '/client'));




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
        await User.likeSongInDb(username, songId); 
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

// BACKEND ROUTE FOR LIKED SONGS


app.get('/user/liked/:username', async (req, res) => {
    try {
        const likedSongs = await User.getLikedSongs(req.params.username);
        res.json(likedSongs);
    } catch (error) {
        res.status(500).json({ error: 'Error getting liked songs.' });
    }
});

app.post('/user/unlike', async (req, res) => {
    const { username, songId } = req.body;
    try {
      await User.unlikeSong(username, songId);
      res.json({ success: true, message: 'Song unliked successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error unliking the song.' });
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
