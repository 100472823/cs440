class MusicLibrary {
    constructor() {
        this.songs = []; // Array of Song objects
    }

    addSong(song) {
        this.songs.push(song);
    }

    getAllSongs() {
        return this.songs;
    }

    findSongByGenre(genre) {
        return this.songs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
    }

    findSongByArtist(artist) {
        return this.songs.filter(song => song.artist.toLowerCase() === artist.toLowerCase());
    }
}

module.exports = MusicLibrary;
