document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('loggedInUser');
    if (!username) return (window.location.href = 'login.html');
  
    document.getElementById('username-display').textContent = username;
  
    const allSongsList = document.getElementById('all-songs');
    const likedSongsList = document.getElementById('liked-songs');
    const recommendedSongsList = document.getElementById('recommended-songs');
  
    // Load all playlists on page load
    fetch(`/playlist/user/${username}`)
      .then(res => res.json())
      .then(playlists => {
        playlists.forEach(playlist => {
          addPlaylistToList(playlist.name);
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
  
          // Like song
          li.querySelector('.like-btn').addEventListener('click', () => {
            fetch('/user/like', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, songId: song.title })
            })
              .then(res => res.json())
              .then(data => alert(data.message));
          });
  
          // Add to playlist
          const playlistBtn = li.querySelector('.add-to-playlist-btn');
          const dropdownContainer = document.createElement('div');
          dropdownContainer.classList.add('playlist-dropdown');
          dropdownContainer.style.display = 'none';
          dropdownContainer.style.marginTop = '8px';
          li.appendChild(dropdownContainer);
  
          playlistBtn.addEventListener('click', () => {
            dropdownContainer.style.display = dropdownContainer.style.display === 'none' ? 'block' : 'none';
  
            if (dropdownContainer.innerHTML !== '') return;
  
            fetch(`/playlist/user/${username}`)
              .then(res => res.json())
              .then(playlists => {
                if (playlists.length === 0) {
                  dropdownContainer.innerHTML = '<p>No playlists found.</p>';
                  return;
                }
  
                const select = document.createElement('select');
                playlists.forEach(p => {
                  const option = document.createElement('option');
                  option.value = p.name;
                  option.textContent = p.name;
                  select.appendChild(option);
                });
  
                const addBtn = document.createElement('button');
                addBtn.textContent = 'Add';
                addBtn.style.marginLeft = '10px';
  
                addBtn.addEventListener('click', () => {
                  const playlistId = select.value;
                  fetch('/playlist/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      username,
                      playlistId,
                      songId: song.title
                    })
                  })
                    .then(res => res.json())
                    .then(() => {
                      alert(`Added to "${playlistId}"`);
                      dropdownContainer.style.display = 'none';
                    });
                });
  
                dropdownContainer.appendChild(select);
                dropdownContainer.appendChild(addBtn);
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
  
  // Playlist form toggle
  function toggleCreatePlaylistForm() {
    const form = document.getElementById('create-playlist-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }
  
  // Create a new playlist
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
          addPlaylistToList(playlistName);
          document.getElementById('new-playlist-name').value = '';
          toggleCreatePlaylistForm();
        } else {
          alert(data.message || 'Error creating playlist.');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Server error creating playlist.');
      });
  }
  
  // Add playlist to list with song viewer
  function addPlaylistToList(name) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${name}</strong> <button>Show Songs</button>`;
  
    const songList = document.createElement('ul');
    songList.style.display = 'none';
    songList.style.marginTop = '10px';
  
    const toggleBtn = li.querySelector('button');
    toggleBtn.addEventListener('click', () => {
      const username = localStorage.getItem('loggedInUser');
  
      // toggle open/close
      if (songList.style.display === 'none') {
        // 🔍 Add logging
        console.log(`Fetching songs from /playlist/${username}/${name}`);
  
        fetch(`/playlist/${username}/${name}`)
          .then(res => res.json())
          .then(songs => {
            console.log('🎵 Songs in playlist:', songs); // debug
  
            songList.innerHTML = '';
  
            if (!Array.isArray(songs) || songs.length === 0) {
              const emptyMsg = document.createElement('li');
              emptyMsg.textContent = 'No songs in this playlist.';
              songList.appendChild(emptyMsg);
            } else {
              songs.forEach(song => {
                const songItem = document.createElement('li');
                songItem.innerHTML = `
                  ${song.title} - ${song.artist}
                  <button style="margin-left:10px;">🗑️</button>
                `;
  
                // Remove from playlist
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
                      songItem.remove();
                    });
                });
  
                songList.appendChild(songItem);
              });
            }
  
            songList.style.display = 'block';
            toggleBtn.textContent = 'Hide Songs';
          })
          .catch(err => {
            console.error('❌ Error loading playlist songs:', err);
          });
      } else {
        songList.style.display = 'none';
        toggleBtn.textContent = 'Show Songs';
      }
    });
  
    li.appendChild(songList);
    document.getElementById('user-playlists').appendChild(li);
  }
  