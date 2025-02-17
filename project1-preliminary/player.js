document.addEventListener('DOMContentLoaded', () => {
    fetch('/songs')
      .then((res) => res.json())
      .then((songs) => {
        const list = document.getElementById('song-list');
        songs.forEach((song) => {
          const li = document.createElement('li');
          li.textContent = song;
          list.appendChild(li);
        });
      })
      .catch((err) => console.error('Error:', err));
  });
  