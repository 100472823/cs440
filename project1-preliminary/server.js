const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5500;  // Puedes usar el puerto que quieras

// Permite servir archivos estáticos (HTML, CSS, JS, imágenes) desde la misma carpeta:
app.use(express.static(__dirname));

// Para parsear JSON y datos de formularios en el body:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ENDPOINT: Obtener lista de canciones
app.get('/songs', (req, res) => {
  fs.readFile('songs.txt', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer songs.txt.' });
    }
    const songs = data
      .split('\n')
      .map((song) => song.trim())
      .filter((song) => song);
    res.json(songs);
  });
});

// ENDPOINT: Login de usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('database.txt', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al procesar la base de datos.' });
    }

    // Cada línea tiene formato:  usuario/password
    const users = data.split('\n').filter(Boolean);
    for (let user of users) {
      const [storedUsername, storedPassword] = user.split('/');
      if (
        storedUsername &&
        storedPassword &&
        username.trim() === storedUsername.trim() &&
        password.trim() === storedPassword.trim()
      ) {
        return res.json({ success: true });
      }
    }
    // Si no coincide ninguno, devolvemos error
    res.json({ success: false, message: 'Credenciales inválidas.' });
  });
});

// ENDPOINT: Registro de usuario
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.json({ success: false, message: 'Se requieren username y password.' });
  }

  fs.readFile('database.txt', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al procesar la base de datos.' });
    }

    // Revisamos si el usuario ya existe
    const lines = data.split('\n').filter(Boolean);
    for (let line of lines) {
      const [storedUsername] = line.split('/');
      if (storedUsername && username.trim() === storedUsername.trim()) {
        return res.json({ success: false, message: 'El usuario ya existe.' });
      }
    }

    // Si no existe, lo añadimos
    const newLine = `${username}/${password}\n`;
    fs.appendFile('database.txt', newLine, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar el nuevo usuario.' });
      }
      res.json({ success: true });
    });
  });
});

// Arrancamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
