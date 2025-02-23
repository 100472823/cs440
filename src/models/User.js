// User Class
class User {
    constructor(id, name, preferences = []) {
        this.id = id;
        this.name = name;
        this.preferences = preferences; // e.g., ["rock", "pop"]
        this.playlists = [];
    }

    addPlaylist(playlist) {
        this.playlists.push(playlist);
    }

    updatePreferences(preferences) {
        this.preferences = preferences;
    }
}
