class Playlist {
    constructor(id, name, owner) {
        this.id = id;
        this.name = name;
        this.songs = []; // Array of Song objects
        this.owner = owner; // User object
    }

    addSong(song) {
        if (!this.songs.includes(song)) {
            this.songs.push(song);
        }
    }

    removeSong(song) {
        this.songs = this.songs.filter(s => s.id !== song.id);
    }

    shuffle() {
        this.songs.sort(() => Math.random() - 0.5);
    }
}

module.exports = Playlist;
