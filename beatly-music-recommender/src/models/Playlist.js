const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../../database/database.json');
const songsPath = path.join(__dirname, '../../database/songs.json');

class Playlist {
  // Add a song to a playlist
  static async addSong(username, playlistId, songTitle) {
    const users = await Playlist.readUsers();
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    const playlist = user.playlists.find(p => p.id === playlistId || p.name === playlistId);
    if (!playlist) throw new Error('Playlist not found');

    if (!playlist.songs.includes(songTitle)) {
      playlist.songs.push(songTitle);
    }

    await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
    return playlist;
  }

  //  Remove a song from a playlist
  static async removeSong(username, playlistId, songTitle) {
    const users = await Playlist.readUsers();
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    const playlist = user.playlists.find(p => p.id === playlistId || p.name === playlistId);
    if (!playlist) throw new Error('Playlist not found');

    playlist.songs = playlist.songs.filter(title => title !== songTitle);

    await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
    return playlist;
  }

  // 🎵 Get full song objects from a playlist
  static async getSongsInPlaylist(username, playlistId) {
    const users = await Playlist.readUsers();
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('User not found');

    const playlist = user.playlists.find(p => p.id === playlistId || p.name === playlistId);
    if (!playlist) throw new Error('Playlist not found');

    const allSongs = JSON.parse(await fs.readFile(songsPath, 'utf8'));
    const playlistSongs = playlist.songs.map(title =>
      allSongs.find(song => song.title === title)
    ).filter(Boolean);

    return playlistSongs;
  }

  //  Shuffle a playlist (optional route)
  static async shuffle(playlistId) {
    const users = await Playlist.readUsers();
    for (const user of users) {
      const playlist = user.playlists.find(p => p.id === playlistId || p.name === playlistId);
      if (playlist) {
        playlist.songs.sort(() => Math.random() - 0.5);
        await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
        return playlist;
      }
    }
    throw new Error('Playlist not found');
  }

  //  Helper: Read users from database
  static async readUsers() {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  }
}

module.exports = Playlist;
