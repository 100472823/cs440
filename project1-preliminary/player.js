document.addEventListener('DOMContentLoaded', () => {
    fetch('/songs')
        .then(response => response.json())
        .then(songs => {
            const songList = document.getElementById('song-list');
            songs.forEach(song => {
                const li = document.createElement('li');
                li.textContent = song;
                songList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching songs:', error));
});
