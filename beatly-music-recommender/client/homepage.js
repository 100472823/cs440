document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('loggedInUser');
    if (!username) return (window.location.href = 'login.html');
  
    document.getElementById('username-display').textContent = username;
  
    const allSongsList = document.getElementById('all-songs');
    const likedSongsList = document.getElementById('liked-songs');
    const recommendedSongsList = document.getElementById('recommended-songs');

    fetch(`/playlist/user/${username}`)
    .then(res => res.json())
    .then(playlists => {
      console.log("✅ Loaded playlists:", playlists); // Debug log
      playlists.forEach(playlist => {
        addPlaylistToList(playlist.name); // ✅ this triggers rendering
      });
    })
    .catch(err => console.error("Error loading playlists:", err));
  
    // Load all songs
    fetch('/songs')
      .then(res => res.json())
      .then(songs => {
        songs.forEach(song => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${song.title} - ${song.artist} (${song.genre})
            <button class="like-btn">❤️ Like</button>
            <button class="add-to-playlist-btn">➕ Add to Playlist</button>
          `;
  
          li.querySelector('.like-btn').addEventListener('click', () => {
            fetch('/user/like', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, songId: song.title })
            })
            .then(res => res.json())
            .then(data => alert(data.message));
          });
  
          li.querySelector('.add-to-playlist-btn').addEventListener('click', () => {
            const playlistName = prompt("Enter playlist name:");
            if (!playlistName) return;
  
            // Create playlist first (or skip if it exists in the backend)
            fetch('/playlist/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, name: playlistName })
            })
            .then(res => res.json())
            .then(() => {
              // Then add song to playlist
              fetch('/playlist/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, playlistId: playlistName, songId: song.title })
              })
              .then(res => res.json())
              .then(data => alert(`Added to "${playlistName}"`));
            });
          });
  
          allSongsList.appendChild(li);
        });
      });
  
    // Load liked songs
    fetch(`/user/liked/${username}`)
    .then(res => res.json())
    .then(songs => {
    songs.forEach(song => {
      const li = document.createElement('li');
      li.innerHTML = `${song.title} - ${song.artist} <button style="margin-left:10px;">🗑️</button>`;

      li.querySelector('button').addEventListener('click', () => {
        fetch('/user/unlike', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, songId: song.title })
        })
        .then(res => res.json())
        .then(() => {
          li.remove(); // Remove from UI
        });
      });

      likedSongsList.appendChild(li);
    });
  });

  
    // Load recommendations
    fetch(`/recommendations/${username}`)
      .then(res => res.json())
      .then(songs => {
        songs.forEach(song => {
          const li = document.createElement('li');
          li.textContent = `${song.title} - ${song.artist}`;
          recommendedSongsList.appendChild(li);
        });
      });

      


  });
  
  function toggleCreatePlaylistForm() {
    const form = document.getElementById('create-playlist-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
  
  function createPlaylist() {
    const username = localStorage.getItem('loggedInUser');
    const playlistName = document.getElementById('new-playlist-name').value.trim();
  
    if (!playlistName) {
      alert("Please enter a playlist name.");
      return;
    }
  
    fetch('/playlist/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name: playlistName })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          addPlaylistToList(playlistName); // Add to visible list
          document.getElementById('new-playlist-name').value = '';
          toggleCreatePlaylistForm(); // Hide the form
        } else {
          alert(data.message || 'Error creating playlist.');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Server error creating playlist.');
      });
  }
  
  function addPlaylistToList(name) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${name}</strong> <button>Show Songs</button>`;
  
    const songList = document.createElement('ul');
    songList.style.display = 'none';
    songList.style.marginTop = '10px';
  
    const toggleBtn = li.querySelector('button');
    toggleBtn.addEventListener('click', () => {
      const username = localStorage.getItem('loggedInUser');
      if (songList.style.display === 'none') {
        // Load songs from backend
        fetch(`/playlist/${username}/${name}`)
          .then(res => res.json())
          .then(songs => {
            songList.innerHTML = '';
            songs.forEach(song => {
              const songItem = document.createElement('li');
              songItem.innerHTML = `
                ${song.title} - ${song.artist}
                <button style="margin-left:10px;">🗑️</button>
              `;
  
              songItem.querySelector('button').addEventListener('click', () => {
                fetch('/playlist/remove', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username,
                    playlistId: name,
                    songId: song.title
                  })
                })
                .then(res => res.json())
                .then(() => {
                  songItem.remove(); // Remove from view
                });
              });
  
              songList.appendChild(songItem);
            });
  
            songList.style.display = 'block';
            toggleBtn.textContent = 'Hide Songs';
          });
      } else {
        songList.style.display = 'none';
        toggleBtn.textContent = 'Show Songs';
      }
    });
  
    li.appendChild(songList);
    document.getElementById('user-playlists').appendChild(li);
  }
  
  