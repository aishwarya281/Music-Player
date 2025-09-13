const songs = [
            {
                title: "Good Vibes",
                artist: "Luke Bergs & LiQWYD",
                src: "assets/Luke-Bergs-LiQWYD-Good-Vibes(chosic.com).mp3",
                albumArt: "https://tse3.mm.bing.net/th/id/OIP.XtFqzbneWYJZU3wCMItCvgHaE6?pid=Api&P=0&h=180",
                isFavorite: false
            },
            {
                title: "Lovely (Good Vibes)",
                artist: "Frequently Asked Music",
                src: "assets/good-vibes-180952.mp3",
                albumArt: "https://wallpaperbat.com/img/48988022-music-aesthetic-wallpaper-iphone.jpg",
                isFavorite: false
            },
            {
                title: "Good Vibes",
                artist: "ColorfulSound",
                src: "assets/good-vibes-16068.mp3",
                albumArt: "https://tse4.mm.bing.net/th/id/OIP.UlPzMpcnfKrpZgRsFmolHAHaJQ?pid=Api&P=0&h=180",
                isFavorite: false
            },
            {
                title: "Good Vibes",
                artist: "Dj No_One",
                src: "assets/groovy-good-vibes-220768.mp3",
                albumArt: "https://tse4.mm.bing.net/th/id/OIP.gXclg3Yj6lP5QSmQfEnNdAHaJ4?pid=Api&P=0&h=180",
                isFavorite: false
            },
            {
                title: "Feel Good Vibes",
                artist: "MVMT Music",
                src: "assets/good-vibes-317673.mp3",
                albumArt: "https://cdn.photoworkout.com/images/guides/aesthetics-in-photography/aesthetics-in-photography-6.jpg",
                isFavorite: false
            },
            {
                title: "Good Vibes",
                artist: "WarmMusic",
                src: "assets/yoitrax-good-vibes.mp3",
                albumArt: "https://i.pinimg.com/originals/b2/cd/7f/b2cd7f2415cb15489789adf0ad29f4e6.jpg",
                isFavorite: false
            },
            {
                title: "Good Vibes",
                artist: "Maniotto",
                src: "assets/nocturnal-whispers_95832.mp3",
                albumArt: "https://wallpapers.com/images/hd/love-aesthetic-couple-silhouette-2rzz99njv2booddw.jpg",
                isFavorite: false
            },
            {
                title: "Good Vibes",
                artist: "SonicMusic",
                src: "assets/mixkit-serene-view-443.mp3",
                albumArt: "https://wallpaperaccess.com/full/84249.jpg",
                isFavorite: false
            },
       
    
        ];

        let currentSongIndex = 0;
        let isPlaying = false;
        let activePlaylist = songs;

        // Load favorite songs from local storage on startup
        const storedFavorites = localStorage.getItem('favoriteSongs');
        if (storedFavorites) {
            const favoriteTitles = JSON.parse(storedFavorites);
            songs.forEach(song => {
                if (favoriteTitles.includes(song.title)) {
                    song.isFavorite = true;
                }
            });
        }

        // Get DOM elements
        const audio = document.getElementById('audio-element');
        const playBtn = document.getElementById('play-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const albumArt = document.getElementById('album-art');
        const songTitle = document.getElementById('song-title');
        const artistName = document.getElementById('artist-name');
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const playlist = document.getElementById('playlist');
        const volumeContainer = document.getElementById('volume-container');
        const volumeBar = document.getElementById('volume-bar');
        const currentTimeEl = document.getElementById('current-time');
        const durationTimeEl = document.getElementById('duration-time');
        const allSongsBtn = document.getElementById('all-songs-btn');
        const favoritesBtn = document.getElementById('favorites-btn');

        // Helper function to format time
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Function to load a new song
        function loadSong(song, index) {
            songTitle.textContent = song.title;
            artistName.textContent = song.artist;
            albumArt.src = song.albumArt;
            audio.src = song.src;
            updatePlaylistActiveState(index);
            audio.load();
        }

        // Play or Pause the song
        function togglePlayPause() {
            if (isPlaying) {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                albumArt.classList.remove('playing');
            } else {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                albumArt.classList.add('playing');
            }
            isPlaying = !isPlaying;
        }

        // Go to the previous song
        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + activePlaylist.length) % activePlaylist.length;
            loadSong(activePlaylist[currentSongIndex], currentSongIndex);
            if (isPlaying) {
                audio.play();
            }
        }

        // Go to the next song
        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % activePlaylist.length;
            loadSong(activePlaylist[currentSongIndex], currentSongIndex);
            if (isPlaying) {
                audio.play();
            }
        }

        // Update progress bar and time
        function updateProgress(e) {
            const { duration, currentTime } = e.srcElement;
            if (isNaN(duration)) return;
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(currentTime);
        }

        // Set progress on click
        function setProgress(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        }

        // Set duration when metadata is loaded
        audio.addEventListener('loadedmetadata', () => {
            if (!isNaN(audio.duration)) {
                durationTimeEl.textContent = formatTime(audio.duration);
            } else {
                durationTimeEl.textContent = '0:00';
            }
        });

        // Set volume on click
        function setVolume(e) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const volume = clickX / width;
            audio.volume = volume;
            volumeBar.style.width = `${volume * 100}%`;
        }
        
        // Render the playlist
        function renderPlaylist(playlistData) {
            playlist.innerHTML = '';
            playlistData.forEach((song, index) => {
                const li = document.createElement('li');
                li.classList.add('playlist-item');
                li.dataset.index = index;
                li.dataset.title = song.title;

                const img = document.createElement('img');
                img.classList.add('w-12', 'h-12', 'rounded-lg', 'object-cover');
                img.src = song.albumArt;
                img.alt = song.title;

                const info = document.createElement('div');
                info.classList.add('playlist-info');
                info.innerHTML = `
                    <h4 class="font-semibold text-white">${song.title}</h4>
                    <p class="text-sm text-gray-400">${song.artist}</p>
                `;

                const favoriteBtn = document.createElement('button');
                favoriteBtn.classList.add('favorite-btn');
                if (song.isFavorite) {
                    favoriteBtn.classList.add('is-favorite');
                }
                favoriteBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                `;
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(song.title);
                });


                li.appendChild(img);
                li.appendChild(info);
                li.appendChild(favoriteBtn);
                playlist.appendChild(li);
            });
        }

        // Toggle favorite status
        function toggleFavorite(songTitle) {
            const song = songs.find(s => s.title === songTitle);
            if (song) {
                song.isFavorite = !song.isFavorite;
                saveFavorites();
                renderPlaylist(activePlaylist);
                updatePlaylistActiveState(currentSongIndex);
            }
        }
        
        // Save favorite songs to local storage
        function saveFavorites() {
            const favoriteSongsTitles = songs.filter(s => s.isFavorite).map(s => s.title);
            localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongsTitles));
        }

        // Update the active class on the playlist items
        function updatePlaylistActiveState(index) {
            const allItems = playlist.querySelectorAll('.playlist-item');
            allItems.forEach((item, i) => {
                const songTitleFromItem = item.dataset.title;
                const activeSongTitle = activePlaylist[currentSongIndex].title;
                if (songTitleFromItem === activeSongTitle) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        // Handle a click on a playlist item
        function handlePlaylistClick(e) {
            const clickedItem = e.target.closest('.playlist-item');
            if (clickedItem) {
                const clickedSongTitle = clickedItem.dataset.title;
                const newIndex = activePlaylist.findIndex(song => song.title === clickedSongTitle);
                if (newIndex !== currentSongIndex) {
                    currentSongIndex = newIndex;
                    loadSong(activePlaylist[currentSongIndex], currentSongIndex);
                    if (isPlaying) {
                        audio.play();
                    } else {
                        togglePlayPause(); // Auto-play if not already playing
                    }
                }
            }
        }

        // Event listeners
        playBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        audio.addEventListener('timeupdate', updateProgress);
        progressContainer.addEventListener('click', setProgress);
        volumeContainer.addEventListener('click', setVolume);
        audio.addEventListener('ended', nextSong);
        playlist.addEventListener('click', handlePlaylistClick);
        allSongsBtn.addEventListener('click', () => {
            activePlaylist = songs;
            renderPlaylist(activePlaylist);
            updatePlaylistActiveState(currentSongIndex);
        });
        favoritesBtn.addEventListener('click', () => {
            activePlaylist = songs.filter(song => song.isFavorite);
            renderPlaylist(activePlaylist);
            updatePlaylistActiveState(currentSongIndex);
        });

        // Initial load
        window.onload = () => {
          renderPlaylist(songs);
          loadSong(songs[currentSongIndex], currentSongIndex);
        };