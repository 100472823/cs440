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
        if (!this.likedSongs.includes(song)) {
            this.likedSongs.push(song);
        }
    }

    getRecommendations(recommendationEngine) {
        return recommendationEngine.generateRecommendations(this);
    }
}

module.exports = User;
