const fs = require('fs').promises;
const path = require('path');
const Playlist = require('./Playlist');

const dbPath = path.resolve(__dirname, '../database/database.json');
const songsPath = path.resolve(__dirname, '../database/songs.json');

class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.likedSongs = [];
        this.playlists = [];
    }

    likeSong(song) {
        if (!this.likedSongs.find(s => s.id === song.id)) {
            this.likedSongs.push(song);
        }
    }

    static async register(username, password) {
        console.log(" Attempting to register user:", username);

        const users = await readDatabase();
        console.log(" Current database users:", users);

        if (users.some(user => user.username === username)) {
            console.log("User already exists:", username);
            return { success: false, message: 'Username already taken.' };
        }

        const newUser = { username, password, likedSongs: [], playlists: [] };
        users.push(newUser);

        try {
            await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
            console.log("User added successfully:", newUser);
            return { success: true, message: 'Signup successful!' };
        } catch (error) {
            console.error("Error writing to database:", error);
            return { success: false, message: 'Error saving user.' };
        }
    }

    static async validateCredentials(username, password) {
        console.log("Validating credentials for:", username);

        const users = await readDatabase();
        console.log("Database users:", users);

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            console.log("User found in database:", username);
            return true;
        }

        console.log("User NOT found in database:", username);
        return false;
    }

    static async likeSongInDb(username, songTitle) {
        const users = await readDatabase();
        const user = users.find(u => u.username === username);

        if (!user) throw new Error('User not found');

        if (!user.likedSongs) user.likedSongs = [];

        if (!user.likedSongs.includes(songTitle)) {
            user.likedSongs.push(songTitle);
            await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
        }
    }

    static async unlikeSong(username, songTitle) {
        const users = await readDatabase();
        const user = users.find(u => u.username === username);
        if (!user) throw new Error('User not found');

        user.likedSongs = user.likedSongs.filter(title => title !== songTitle);
        await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
    }

    static async getLikedSongs(username) {
        const users = await readDatabase();
        const user = users.find(u => u.username === username);
        if (!user || !user.likedSongs) return [];

        const songs = JSON.parse(await fs.readFile(songsPath, 'utf8'));
        return songs.filter(song => user.likedSongs.includes(song.title));
    }

    static async createPlaylist(username, name) {
        const users = await readDatabase();
        const user = users.find(u => u.username === username);
        if (!user) throw new Error('User not found');

        if (!user.playlists) user.playlists = [];

        if (user.playlists.some(p => p.name === name)) {
            throw new Error('Playlist already exists');
        }

        const newPlaylist = {
            id: name,
            name,
            songs: []
        };

        user.playlists.push(newPlaylist);
        await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
        return newPlaylist;
    }

    static async getUser(username) {
        const data = await fs.readFile(dbPath, 'utf8');
        const users = JSON.parse(data);
        return users.find(user => user.username === username) || null;
    }
}

async function readDatabase() {
    try {
        console.log("Reading database from:", dbPath);
        const data = await fs.readFile(dbPath, 'utf8');

        console.log("Raw database content:", data);
        const users = JSON.parse(data);
        console.log("Parsed database users:", users);
        return users;
    } catch (error) {
        console.error('Error reading database:', error);
        return [];
    }
}

module.exports = {
    User,
    readDatabase
};
