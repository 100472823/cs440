document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('loggedInUser');
    if (!username) {
      window.location.href = 'login.html';
      return;
    }
  
    document.getElementById('username-display').textContent = username;
  
    // 1. Load all songs
    fetch('/songs')
      .then(res => res.json())
      .then(songs => {
        const list = document.getElementById('all-songs');
        songs.forEach(song => {
          const li = document.createElement('li');
          li.textContent = `${song.title} - ${song.artist} (${song.genre})`;
          list.appendChild(li);
        });
      });
  
    // 2. Load liked songs
    fetch(`/user/liked/${username}`)
      .then(res => res.json())
      .then(songs => {
        const list = document.getElementById('liked-songs');
        songs.forEach(song => {
          const li = document.createElement('li');
          li.textContent = `${song.title} - ${song.artist}`;
          list.appendChild(li);
        });
      });
  
    // 3. Load recommendations
    fetch(`/recommendations/${username}`)
      .then(res => res.json())
      .then(songs => {
        const list = document.getElementById('recommended-songs');
        songs.forEach(song => {
          const li = document.createElement('li');
          li.textContent = `${song.title} - ${song.artist}`;
          list.appendChild(li);
        });
      });
  });
  