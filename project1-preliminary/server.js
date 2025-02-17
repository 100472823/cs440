const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Obtener lista de canciones
app.get('/songs', (req, res) => {
    fs.readFile('songs.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading songs file.');
        const songs = data.split('\n').map(song => song.trim()).filter(song => song);
        res.json(songs);
    });
});

// Login de usuario
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('database.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error processing database.');

        const users = data.split('\n');
        for (let user of users) {
            const [storedUsername, storedPassword] = user.split('/');
            if (username.trim() === storedUsername.trim() && password.trim() === storedPassword.trim()) {
                return res.send({ success: true });
            }
        }
        res.send({ success: false });
    });
});

// Registro de usuario
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('database.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error processing database.');

        const users = data.split('\n').map(line => line.split('/')[0]);
        if (users.includes(username.trim())) {
            return res.send({ success: false, message: 'Username already exists.' });
        }

        fs.appendFile('database.txt', `${username}/${password}\n`, (err) => {
            if (err) return res.status(500).send('Error saving user.');
            res.send({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
