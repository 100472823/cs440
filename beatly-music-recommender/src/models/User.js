const fs = require('fs').promises;
const path = require('path');
const Playlist = require('./Playlist');

const dbPath = path.join(__dirname, '..', 'database.txt');

class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.likedSongs = []; // Array of Song objects
        this.playlists = []; // Array of Playlist objects
    }

    createPlaylist(name) {
        const playlist = new Playlist(this.playlists.length + 1, name, this);
        this.playlists.push(playlist);
        return playlist;
    }

    likeSong(song) {
        if (!this.likedSongs.find(s => s.id === song.id)) {
            this.likedSongs.push(song);
        }
    }

    static async getUser(username) {
        const data = await fs.readFile(dbPath, 'utf8');
        const users = data.split('\n').filter(Boolean).map(line => {
            const [storedUsername, storedPassword] = line.split('/');
            return new User(storedUsername, storedUsername, storedPassword);
        });
        return users.find(user => user.username === username) || null;
    }

    static async register(username, password) {
        const existingUser = await User.getUser(username);
        if (existingUser) {
            return { success: false, message: 'User already exists.' };
        }
        await fs.appendFile(dbPath, `${username}/${password}\n`);
        return { success: true };
    }

    static async validateCredentials(username, password) {
        const user = await User.getUser(username);
        return user && user.password === password;
    }
}

module.exports = User;
