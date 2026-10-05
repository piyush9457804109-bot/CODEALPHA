document.addEventListener('DOMContentLoaded', function() {

    // Define mock music collection database array
    const songs = [
        {
            title: "Summer Breeze",
            artist: "Chill Lab",
            cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            title: "Neon Horizon",
            artist: "Synth Runner",
            cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "Midnight Cafe",
            artist: "Lo-Fi Beats",
            cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
    ];

    // Grab interface element mappings
    const audio = document.getElementById('audio-engine');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const trackCover = document.getElementById('track-cover');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    
    const progressBar = document.getElementById('progress-bar');
    const currentTimeText = document.getElementById('current-time');
    const durationText = document.getElementById('total-duration');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistUI = document.getElementById('playlist-list');

    // Execution tracking state variables
    let songIdx = 0;
    let isPlaying = false;

    // Boot up the first song immediately
    loadSong(songs[songIdx]);
    buildPlaylist();

    // Setup initial sound target state
    audio.volume = volumeSlider.value;

    // --- Core Action Audio Operations ---
    function loadSong(song) {
        trackTitle.innerText = song.title;
        trackArtist.innerText = song.artist;
        trackCover.src = song.cover;
        audio.src = song.url;
        
        // Reset timestamps on file swaps
        currentTimeText.innerText = "0:00";
        progressBar.value = 0;
    }

    function togglePlay() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function playTrack() {
        isPlaying = true;
        playBtn.innerText = "⏸"; // Swap icon representation safely
        audio.play().catch(err => console.log("User interaction required first:", err));
    }

    function pauseTrack() {
        isPlaying = false;
        playBtn.innerText = "▶";
        audio.pause();
    }

    function changeTrack(direction) {
        songIdx += direction;

        // Loop array boundaries cleanly
        if (songIdx >= songs.length) songIdx = 0;
        if (songIdx < 0) songIdx = songs.length - 1;

        loadSong(songs[songIdx]);
        
        // Bonus: Autoplay functional handoff logic on navigation requests
        playTrack();
        updatePlaylistHighlight();
    }

    // --- Interface Update Handlers ---
    
    // Tracks matching progress ranges as media streams run
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const currentPct = (audio.currentTime / audio.duration) * 100;
            progressBar.value = currentPct;
            
            // Render textual tracking logs strings 
            currentTimeText.innerText = formatTimeString(audio.currentTime);
            durationText.innerText = formatTimeString(audio.duration);
        }
    });

    // Handle updating loaded tracks duration once metadata finishes buffering
    audio.addEventListener('loadedmetadata', () => {
        durationText.innerText = formatTimeString(audio.duration);
    });

    // Real-time timeline slider adjustments
    progressBar.addEventListener('input', () => {
        if (audio.duration) {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        }
    });

    // Control sound gain setting mapping changes
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    // Bonus: Autoplay next track right as current audio ends naturally
    audio.addEventListener('ended', () => {
        changeTrack(1);
    });

    // Helper formatting math converting floats to time strings
    function formatTimeString(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        if (secs < 10) secs = '0' + secs;
        return `${mins}:${secs}`;
    }

    // --- Playlist Builder (Bonus) ---
    function buildPlaylist() {
        playlistUI.innerHTML = ''; // wipe defaults safely
        songs.forEach((song, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${song.title}</span> <span style="color:#777">${song.artist}</span>`;
            
            // Let users skip cleanly straight to a choice
            li.addEventListener('click', () => {
                songIdx = idx;
                loadSong(songs[songIdx]);
                playTrack();
                updatePlaylistHighlight();
            });

            playlistUI.appendChild(li);
        });
        updatePlaylistHighlight();
    }

    function updatePlaylistHighlight() {
        const items = playlistUI.querySelectorAll('li');
        items.forEach((item, idx) => {
            if (idx === songIdx) {
                item.classList.add('current-playing');
            } else {
                item.classList.remove('current-playing');
            }
        });
    }

    // --- Click Event Listeners ---
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', () => changeTrack(1));
    prevBtn.addEventListener('click', () => changeTrack(-1));
});