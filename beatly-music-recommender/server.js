const express = require('express');
const app = express();
const PORT = 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./src/routes/userRoutes');
const playlistRoutes = require('./src/routes/playlistRoutes');
const songRoutes = require('./src/routes/songRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');

// Use Routes
app.use('/user', userRoutes);
app.use('/playlist', playlistRoutes);
app.use('/songs', songRoutes);
app.use('/recommendations', recommendationRoutes);

// Static Files
app.use(express.static(__dirname + '/public'));
app.use('/client', express.static(__dirname + '/client'));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
