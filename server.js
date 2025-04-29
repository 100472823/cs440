const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;




// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files

app.use(express.static(path.join(__dirname, 'public')));

app.use('/client', express.static(path.join(__dirname, 'client')));

// Import routers
const playlistRoutes = require('./routes/playlistRoutes');
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Use routers
app.use('/playlist', playlistRoutes);
app.use('/user', userRoutes);
app.use('/songs', songRoutes);
app.use('/recommendations', recommendationRoutes);


// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});





