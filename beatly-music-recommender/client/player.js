document.addEventListener('DOMContentLoaded', () => {
  fetch('/songs')
    .then((res) => res.json())
    .then((songs) => {
      const list = document.getElementById('song-list');
      list.innerHTML = ''; // Clear previous items

      songs.forEach((song) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist} (${song.genre})`;
        list.appendChild(li);
      });
    })
    .catch((err) => console.error('Error fetching songs:', err));
});
