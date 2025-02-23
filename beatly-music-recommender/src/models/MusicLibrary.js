const fs = require('fs').promises;
const path = require('path');
const Song = require('./Song');

const songsPath = path.join(__dirname, '..', 'songs.txt');

class MusicLibrary {
    constructor() {
        this.songs = [];
    }

    async loadSongs() {
        const data = await fs.readFile(songsPath, 'utf8');
        this.songs = data.split('\n').filter(Boolean).map((line, index) => {
            const [title, artist, genre, duration] = line.split('/');
            return new Song(index + 1, title, artist, genre, parseInt(duration, 10));
        });
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

module.exports = MusicLibrary;
