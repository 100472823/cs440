class Song {
    constructor(id, title, artist, genre, duration) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.duration = duration;
    }

    play() {
        console.log(`Playing: ${this.title} by ${this.artist}`);
    }

    pause() {
        console.log(`Paused: ${this.title}`);
    }
}

module.exports = Song;
