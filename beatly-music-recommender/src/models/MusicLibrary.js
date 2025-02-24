const fs = require('fs').promises;
const path = require('path');
const Song = require('./Song');

const songsDbPath = path.join(__dirname, '..','..', 'database', 'songs.json'); 

class MusicLibrary {
    constructor() {
        this.songs = [];
    }

    async loadSongs() {
        try {
            console.log("📂 Reading songs from:", songsDbPath);
            const data = await fs.readFile(songsDbPath, 'utf8');

            if (!data.trim()) {
                console.error("ERROR: Songs database is empty!");
                this.songs = [];
                return;
            }

            this.songs = JSON.parse(data).map((song, index) => {
                return new Song(index + 1, song.title, song.artist, song.genre, song.duration || 0);
            });

            console.log("Successfully loaded songs:", this.songs);
        } catch (error) {
            console.error("Error reading songs database:", error);
            this.songs = [];
        }
    }

    async getAllSongs() {
        await this.loadSongs();
        return this.songs;
    }

    async findSongByGenre(genre) {
        await this.loadSongs();
        return this.songs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
    }

    async findSongByArtist(artist) {
        await this.loadSongs();
        return this.songs.filter(song => song.artist.toLowerCase() === artist.toLowerCase());
    }
}

module.exports = new MusicLibrary(); //Export an instance of the class
